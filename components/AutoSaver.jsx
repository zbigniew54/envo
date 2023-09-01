import { useState, useMemo } from "react";
import * as CFG from "~/cfg"  
// ------------------------------------------------------------------------ 
// Saves data (by making a POST request to server) with delay (CFG.AUTO_SUBMIT_DELAY)
// If many calls to save() are made within short period of time (less than 'delay') 
// only one POST request is made (with most recent data)
class AutoSaver
{
    #timeoutId=null 
    route=null                    // URL for POST request

    constructor( r=null ){
        this.route = r 
        // console.log('DelayedPost constructor', this.route)   
    }

    // onStateChangeCallback(state), state = (str) loading / success / error
    save( postData, onStateChangeCallback=null )
    { 
        // If called again before [delay] ms -> clear old timeout and create new starting from now
        if( this.#timeoutId != null )
            clearTimeout( this.#timeoutId )

        const self=this

        this.#timeoutId = setTimeout( async ()=>
        {                  
            const route = this.route ?? window.location.href
            
            const formData = new FormData()  
            for( const key in postData )
                formData.append( key, postData[key] ) 

            if( typeof onStateChangeCallback == "function" )
                onStateChangeCallback("loading")

            fetch( route, {
                method: "POST", 
                body: formData 
            })
            .then(resp=>{
                if( typeof onStateChangeCallback == "function" )
                    onStateChangeCallback("success") 
            })
            .catch(err=> { 
                if( typeof onStateChangeCallback == "function" )
                    onStateChangeCallback("error") 
                console.error( CFG.DEBUG_MODE? err: 'error occured' )  
            }) 
            
            self.#timeoutId = null  	// update state -> no need to clearTimeout
        }, 
        CFG.AUTO_SUBMIT_DELAY )  
    }
} 
// -----------------------------------------------------------------------
// Sends wrapped <input> (as JSON {input.name: input.value, ...data })
// to 'submitRoute' using POST method 

// InputComponent - component (ie EditString, EditRange, ...):
//   onChange(newVal): callback that triggers saving (post request)
//   className="loading" (opt)

// PROPS:
//   name: (req) input.name
//   route: (opt) if null use windows.location.href
//   data: (opt) obj to be sent with POST request {key:value,...}

export default function withAutoSaver( InputComponent )
{
    return function (props)
    {
        const [saveState,setSaveState] = useState("idle")
        const autoSaver = useMemo( ()=> new AutoSaver( props.route ), [] ) // no recreate on re-render
         
        return <InputComponent {...props} 
            className={ ""+ (saveState=="loading"?" loading":"") + props.className } 
            onChange={ (newVal)=>
            {
                if( typeof(props.onChange)=="function" )
                    props.onChange( newVal )

                autoSaver.save({ 
                    ...props.data, 
                    [props.name]: newVal,                     
                }, 
                setSaveState )
            }} />
    }
}
// ------------------------------------------------------------------------ 
/*
USAGE EXAMPLE:

    const EditStringWithAutoSaver = withAutoSaver( EditString )
    const StarRatingWithAutoSaver = withAutoSaver( StarRating )

    <StarRatingWithAutoSaver 
        route={`/photos/${ photoId }/rate`}
        name="newRating"
        rating={ data.rating }  />

    <EditStringWithAutoSaver
        route={`/photos/${ photoId }/rename`}
        name="newName"
        str={ data.name } />

*/
// ------------------------------------------------------------------------ 
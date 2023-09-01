import { useRef, useState } from "react"
import * as CFG from "~/cfg" 
/* ------------------------------------------------------------------------ 

	FORM POST
	
        creates a form that wraps its children (input fields)
        and adds a button that sends this form by fetch( method: POST )
        without reloading a page
         
    PROPS:
        label: buttons label
        hint: tooltip for button
        className: (optional) css class  for button
        name: (optional) name for input type=hidden
        value: (optional) value for input type=hidden
        route: URL to fetch with POST request 
        method: (opt) def "POST"
        children: input elements to send with form
        onResolve: onResolve( returned_post_data  ) 
        onReject: onReject()
        onClick: onClick(e) called on button clicked, if returns false prevents form from sending
         

// -----------------------------------------------------------------------*/
export default function FormPost({ children, name, value, className, label, 
    hint, onResolve, onReject, onClick, route,method })
{
    const [loadingStatus, setLoadingStatus] = useState("idle")
    const formRef=useRef()
 
    function handleFormSubmit( e )
    {
        e.preventDefault()
    
        if( typeof onClick==="function" && onClick(e)===false )
            return
    
        const formData = new FormData( formRef.current )
    
        // console.log( 'fetch',JSON.stringify(Object.fromEntries(formData)) )
     
        setLoadingStatus("loading") 
    
        fetch( route, {
            method: method ?? "POST", 
            body: formData,
            // headers: { "AI-Token": reqData.accessToken } 
        })
        .then(resp=>
        {  
            setLoadingStatus("success") 
    
            if( resp.redirected ) 
                window.location.replace( resp.url )
            
            // if body is JSON data return it else return null (no throw error)
            return resp.json().then(d=>d).catch(e=>null)
        })
        .then(data=>
        {  
            if( typeof onResolve==="function" )
                onResolve(data)
        })
        .catch(err=>
        { 
            setLoadingStatus("error") 
             
            console.error( CFG.DEBUG_MODE? err: 'error occured' ) 
            if( typeof onReject==="function" )
                onReject()
        }) 
    }

    return <form ref={ formRef }>
        { name!==undefined && value!==undefined
            ?<input type="hidden" name={ name } value={ value } />
            :null
        } 
        { children }
        <button
            onClick={e=>handleFormSubmit(e)}
            disabled={ loadingStatus=="loading" }
            className={ className }
            title={ hint }>
            { label }
        </button>
    </form>
}
// ------------------------------------------------------------------------ 
/*
USAGE EXAMPLE:

    // as a single button:
    <FormPost
        label="delete"
        route={"/photos/"+photoId+"/delete"}
        method="DELETE"
    >
    </FormPost> 
    

    // as a form with multiple input fields
    <FormPost
        label="update" 
        route={ "/photos/"+photoId+"/denoise" }  
    >
        <input type="hidden" name="param" value={ props.param } />

        <EditRange
            label="Strength"   
            name="denoiseStrength" 
            num={ props.strength  }  
            hint="Removes noise from the photograph" 
        />                 
    </FormPost> 
*/
// ------------------------------------------------------------------------ 
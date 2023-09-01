import { useNavigation } from "@remix-run/react";
/* ------------------------------------------------------------------------ 
	BUTTON GO   
	    creates a button that behaves as regular navigation link

    PROPS
        to: link.href
        hint 
        className: (optional) input css class 
        onClick: onClick( buttonDOM ), if returns false -> stops navigation

// -----------------------------------------------------------------------*/ 
export default function ButtonGo( props )
{    
    const nv = useNavigation()
    const isLoading = nv.state=="submitting"

    return(   
        <button 
            className={ (props.className?props.className:"") + (isLoading ? " loading":"") }
            disabled={ isLoading }
            onClick={ (e)=>
            { 
                if( props.onClick && props.onClick( e.target, hiddenRef.current )===false )
                    e.preventDefault() 
                else
                    window.location.href = props.to
            }} 
            type="button"
            title={ props.hint }> 
        { props.children } 
        </button>    
    )
}
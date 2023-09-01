import { useState } from "react"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
/* ------------------------------------------------------------------------ 

    BUTTON DROPDOWN 
	    creates a button that shows/hides box with more buttons 
        (or any other content)

    PROPS
        label: for button
        icon: for button
        children: content of the dropdown box area, if array of items -> items should have 'key' attrib
        hint 
        disabled: def false  
        className: (optional) input css class  
        onClick: onClick(e)
        className: for whole componenet <div>
        classNameButton: only for <buttton>
        showOnHover (bool) def true
        hideOnLeave (bool) def true

// -----------------------------------------------------------------------*/ 
export default function ButtonDropdown( props )
{     
	const [collapsed,setCollapsed] = useState( true )
  
    return( 
        <div 
            className={ "dropdown"+(props.className?" "+props.className:"") }
            onMouseOver={ (props.showOnHover!==false)? ()=>{ setCollapsed( false ) }: null }
            onMouseLeave={ (props.hideOnLeave!==false)? ()=>{ setCollapsed( true ) }: null }
        >
            <button 
                type="button"
                className={ (props.classNameButton? props.classNameButton:"")+( props.disabled?" disabled":"")  } 
                disabled={ props.disabled } 
                onClick={ (e)=>
                {
                    setCollapsed( prev => !prev )
                    if( typeof props.onClick == "function" ) 
                        props.onClick(e)
                }}
                title={ props.hint }
            > 
            { props.icon 
                ?<FontAwesomeIcon icon={ props.icon } />
                :null
            }
            { props.label }
            </button>    

            { ( props.disabled ) 
                ?null
                :Array.isArray( props.children )
                    ?<ul 
                        className={ "items" + (collapsed? ' hidden':'') }
                        onClick={(e)=>{ setCollapsed( true ) }} >
                        { props.children.map( (c,i)=> <li key={c.key??i}>{c}</li> ) }
                    </ul>

                    :<div 
                        className={ "items" + (collapsed? ' hidden':'') }
                        onClick={(e)=>{ setCollapsed( true ) }} >
                        { props.children }
                    </div>  
            }
        </div>   
    ) 
} 
// ------------------------------------------------------------------------
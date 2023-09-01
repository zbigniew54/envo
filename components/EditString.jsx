/* ------------------------------------------------------------------------ 
 
	EDIT STRING  
        creates an input that allows to edit a string 

    PROPS:  
        name: input.name and input.id (must be unique)
        data: data to send {name: value,...} 
        title: (optional) input.title
        hint
        className: (optional) input css class
        maxLength: (optional) input.maxlength (def:32) 
        disabled: (optional) input.disabled
        readOnly: (optional) input.readonly
        value: (optional) external state
        onChange: (opt)(callback) -> called just before submit: onChange( newVal )
        placeholder: (optional) input.placeholder
        label: (optional)  
        labelMode: 
            "" - no label
            "center" -> label above input in the center 
            "left" -> label above input alignet to left
            "right" -> label  above input aligned to right
            ?"before" -> labal before input (on left side od input, in the same line)
        
    
// -----------------------------------------------------------------------*/ 
export default function EditString( props )
{
	// const [str,setStr] = useState( props.str ?? "" )
    // const str = props.str ?? ""
	const ml = isNaN( props?.maxLength )? 32 : props.maxLength
    
    const labelBefore = (props.labelMode=='before')
 
    return(
		<>
            { props.label!=""?
                <label htmlFor={ props.name } className={ 
                        labelBefore? 'displayInlineBlock w30p':
                        props.labelMode=='left'?'left':
                        props.labelMode=='right'?'right':
                        props.labelMode=='center'?'center':
                        null } >
                    {  
                        ( props.labelsMode != "" )? props.label : null
                    } 	
                </label>
                :null
            }
            <input   
				type="text" 
				title={ props.hint }
				className={ ""+ (props.className??"") + (labelBefore? 'displayInlineBlock w60p':'')  } 
				name={ props.name }
				value={ props.value  } 
				onChange={ props.readOnly?null:(e)=>
                {
					// setStr( e.target.value ) 
 
                    if( typeof(props.onChange)=="function" )
                        props.onChange( e.target.value )  
				}}
				maxLength={ ml }
				disabled={ props.disabled }
				readOnly={ props.readOnly } 
				placeholder={ props.placeholder }
			/>
		</>	
    )
}
// ------------------------------------------------------------------------ 
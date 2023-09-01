/* ------------------------------------------------------------------------ 
 
    EDIT NUMBER  
        creates an input that allows to edit a number (int or float) 

    PROPS: 
        name: input.name  
        hint
        className: (optional) input css class  
        disabled: (optional) input.disabled
        readOnly: (optional) input.readonly 
        value: (optional) external state
        onChange: (opt)(callback) -> called just before submit: onChange( newVal )
        min: (optional) input.min
        max: (optional) input.max
        step: (optional) input.step 
        placeholder: (optional) input.placeholder
        label: (optional)  
        labelMode: 
            "" - no label
            "center" -> label above input in the center 
            "left" -> label above input alignet to left
            "right" -> label  above input aligned to right
            ?"before" -> labal before input (on left side od input, in the same line)
        
// -----------------------------------------------------------------------*/ 
export default function EditNumber( props )
{
	// const [num,setNum] = useState( props?.num!=undefined ? props.num : 0 ) 
    // const num = props.num  	
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
				type="number" 
				title={ props.hint }
				className={ ""+ (props.className??"") + (labelBefore? 'displayInlineBlock w60p':'') } 
				name={ props.name }
				value={ props.value } 
				onChange={ props.readOnly?null:(e)=>
                { 
					// setNum( e.target.value ) 
 
                    if( typeof(props.onChange)=="function" ) 
                        props.onChange( parseFloat(e.target.value) )  
				}}
				min={ props.min }
				max={ props.max }
				step={ props.step }
				disabled={ props.disabled }
				readOnly={ props.readOnly }
                placeholder={ props.placeholder }
			/>
		</>  
    )
} 
// ------------------------------------------------------------------------ 
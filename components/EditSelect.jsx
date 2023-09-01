/* ------------------------------------------------------------------------ 
 
    EDIT SELECT  
        creates a field that allows to select one value  

        <EditSelect>
            <option value="jpeg" selected>JPEG</option>
            <option value="png">PNG</option>
        </EditSelect>    

    PROPS: 
        name: input.name 
        hint
        className: (optional) input css class  
        disabled: (optional) input.disabled
        readOnly: (optional) input.readonly 
        value: (optional) external state
        onChange: (opt)(callback) -> called just before submit: onChange( newVal )
        label: (optional)  
        labelMode: 
            "" - no label
            "center" -> label above input in the center 
            "left" -> label above input alignet to left
            "right" -> label  above input aligned to right
            ?"before" -> labal before input (on left side od input, in the same line)
        
// -----------------------------------------------------------------------*/ 
export default function EditSelect( props )
{
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
            <select   
				title={ props.hint }
				className={ ""+ (props.className??"") + (labelBefore? 'displayInlineBlock w60p':'') } 
				name={ props.name } 
                // defaultValue={ props.defaultValue ?? props.value }
                value={ props.value }
				onChange={ props.readOnly?null:(e)=>
                {  
                    if( props.onChange )
                        props.onChange( e.target.value )   
				}} 
				disabled={ props.disabled }
				readOnly={ props.readOnly } 
			>
			{ props.children } 
            </select>
		</>  
    )
}
// ------------------------------------------------------------------------ 
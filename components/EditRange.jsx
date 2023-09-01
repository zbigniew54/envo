import { roundPrec } from "~/utils/utils"
/* ------------------------------------------------------------------------ 

	EDIT RANGE  
        creates an input that allows to edit a number in min/max range (int or float)
 
    PROPS:  
        name: input.name 
        value: (optional) value -> state outside this component
        hint
        className: (optional) input css class  
        disabled: (optional) input.disabled
        readOnly: (optional) input.readonly 
        onChange: (opt)(callback) -> called just before submit: onChange( newVal )
        min: input.min
        max: input.max
        def: (opt) default value (restored on dbl click)
        step: input.step
        label: (optional) 
        labelMin: (optional) def: input.min
        labelMax: (optional) def: input.max
        labelsMode: 
            "" - no title + labelMin on left + labelMax on right
            "title" -> title in center + labelMin on left + labelMax on right
            "val" -> cur val (num) in center + labelMin on left + labelMax on right
            "title_val" -> title on left + cur val on right
        valAsPerc: [bool](def:false) 
        valPrecision: [int](def:1)
        labels: (opt) labels to use instead of integers

// -----------------------------------------------------------------------*/ 
export default function EditRange( props )
{
	let valPrecision=1
	if( props.valPrecision )
		valPrecision = props.valPrecision

	let valStr = ''

	if( props.labels && (valStr = props.labels[ parseInt(props.value,10) ]) != undefined )
	{}
	else
	{ 
	    let val = props.value
		if( props.valAsPerc===true )
			val = (val*100.0)

		valStr = ''+roundPrec( parseFloat(val), valPrecision )

		if( props.valAsPerc===true )
			valStr+=' %'
	}
 
    return(
        <>
			<label 
				// className={ ""+ (isLoading?" loading":"") } 
				htmlFor={ props.name }>

				<div className="left">{ 
					( props.labelsMode == "title_val" )? props.label 
					: (props.labelMin!==undefined)? props.labelMin: props.min   
				}</div>	
				<div className="right">{ 
					( props.labelsMode == "title_val" )? valStr
					: (props.labelMax!==undefined)? props.labelMax: props.max 
				}</div>	
				<div className="center">{ 
					( props.labelsMode =="title" )? props.label 
					: ( props.labelsMode =="val" )? valStr: null 
				}</div>	
			</label>
            <input 
				type="range" 
				title={ props.hint }
				className={ props.className } 
				name={ props.name }
				value={ props.value } 
				onChange={ props.readOnly? null:(e)=>
                {   
                    if( typeof(props.onChange)=="function" )
                        props.onChange( parseFloat(e.target.value) )  
				}}
                onDoubleClick={ props.def!==undefined? ()=>
                {  
                    if( typeof(props.onChange)=="function" )
                        props.onChange( parseFloat(props.def) )  
                }: null } 
				min={ props.min }
				max={ props.max }
				step={ props.step }
				disabled={ props.disabled }
				readOnly={ props.readOnly }
			/>
		</>  
    )
}
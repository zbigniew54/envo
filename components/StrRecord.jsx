// ------------------------------------------------------------------------
// props = { name, value or values, values_delim=" " } 
export default function StrRecord( props ) 
{
	if( props.value == undefined && props.values == undefined )
		return null
 
	let values_delim = " "
	if( "values_delim" in props )
		values_delim = props.values_delim

	let strVal=''
	if( props.value !== undefined && props.value != '' && props.value != ' ' )
		strVal += props.value

	if( props.values !== undefined )
		for( let v of props.values  )
			if( v !== undefined && v != '' && v != ' ' )
			{
				strVal += v
				if( v != props.values[ props.values.length-1 ] )
					strVal+= values_delim
			}

	if( strVal=='')
		return null

	return(
		<div className="str_rec">
			<b>{ 
				(props.name!="")? props.name+":": null 
			}</b> { strVal }
		</div>
	)
}
// ------------------------------------------------------------------------
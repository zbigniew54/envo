import { useState } from "react";
/* ------------------------------------------------------------------------ 

    WIDGET
        groups sidebar components
        
        <Widget></Widget>
        
    PROPS:
        label: h3 title, if undef -> widget is not rendered, if "" -> it is rendered with empty title
        hint: (optional) hover hint
        collapsed: (bool) def true
        bindRef: (optional) ref (useRef)

-------------------------------------------------------------------------*/
export default function Widget( props )
{
	if( props.label===undefined )
		return null
	
	const [collapsed,setCollapsed] = useState( props.collapsed===false )

	function widgetToggle( e ){
		setCollapsed( p=>!p )
	}

	return (
		<section 
            ref={ props.bindRef }
			className={ "widget"+ (collapsed?" collapsed":"") } 
			title={ props.hint } > 

			<h3 onClick={ widgetToggle }>{ props.label }</h3>

			{ collapsed? null: props.children  }
		</section> 
	)
}
// -------------------------------------------------------------------------
import { Link } from "@remix-run/react";
import { useState } from "react";

// ------------------------------------------------------------------------ 
// link with confirmation
// props={ to, anchor }
export default function LinkConfirm( props )
{
	const [vis, setVis] = useState(false)

	function visToggle(){
		setVis( p=>!p )
	}

	return (
	  <> 
		<a className="fake-link" onClick={ () => visToggle() }>{ props.anchor }</a>{" "}
		{ vis? 
		<Link 
			className="warn pulseAnim" 
			style={{ display: "inline-block" }} 
			to={ props.to }>[ confirm ]
		</Link> : null }
	  </> )
}
// ------------------------------------------------------------------------ 
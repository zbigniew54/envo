import { useState } from "react"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// ------------------------------------------------------------------------
// PROPS:
//  labels: array of {hint:"Image",icon:faImage}
//  children: tabs content
//  defaultTabIdx: (int)(def:0) [0:n)
export default function Tabs( props )
{ 
    const [activeTab,setActiveTab] = useState( ('defaultTabIdx' in props)? props.defaultTabIdx:0 )
 
	return (
        <div className="tabs"> 
            <ul className="labels">
            {
                props.labels.map( ( c, index )=>
                    <li 
                        key={ index } 
                        onClick={ ()=>{ setActiveTab( index ) } }
                        className={ index==activeTab? 'emp': null }
                        title={c.hint} 
                    >
                        <FontAwesomeIcon icon={c.icon}/>
                    </li>
                )
            }
            </ul>		
            <div className="current_tab">
            {
                props.children[ activeTab ] 
            }
            </div>		 
		</div>
	)
}
// ------------------------------------------------------------------------
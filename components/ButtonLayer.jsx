import { useState } from "react"; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTrash, faCircleQuestion, faFaceSmile, faFaceMeh, faFaceFrown, faCircleExclamation } 
from '@fortawesome/free-solid-svg-icons'

import ButtonDropdown from "~/components/ButtonDropdown"   
import NBSP from "~/components/NBSP"    

/* ------------------------------------------------------------------------ 
	BUTTON LAYER 
        [ vis ][ mask name ][ del ]

    PROPS
        deletable - enables trash button
        hideable - enables eye button
        rateable - enables rating button
        disabled 
        emp - has emp className
        visible - 'eye' 
        onVisibleChange( newVis )
        onClick
        onMouseOver
        onMouseLeave
        onRate - if rateable -> on rating option click -> onRate( int ) int = [1:5]

// -----------------------------------------------------------------------*/ 
export default function ButtonLayer( props )
{   
    const isHideable = ( props.hideable !== false ) 
    const [vis,setVis] = useState( props.visible !== false )

    const defOnRate = props.onRate? props.onRate: (r)=>{}

	return ( 
        <div  className="item" >
        {/* EYE */}
        { isHideable?
            <button 
                onClick={ ()=>{
                    if( props.onVisibleChange ) props.onVisibleChange( !vis )
                    // setVis(!vis)
                    setVis( prev=>!prev )
                }}
                className={
                    "mini eye"
                    + (props.emp? " emp":"") 
                    // + (!isHideable? " hidden":"") 
                    + (isHideable && !vis || props.disabled? " disabled":"")
                }
                disabled={ props.disabled } 
            > 
                <FontAwesomeIcon icon={ faEye } />
            </button>
            :null
        }
        
        {/* MAIN */}
        <button 
            className={ 
                "main" 
                + (props.emp? " emp":"") 
                + (props.disabled? " disabled":"")
            }
            disabled={ props.disabled } 
            onClick={ props.onClick }
            onMouseOver={ props.onMouseOver }
            onMouseLeave={ props.onMouseLeave }
        >
        { props.children }
        </button>

        {/* RATE AI MASK */}
        { props.rateable ? 
            <ButtonDropdown 
                icon={ faCircleQuestion } 
                hint="Rate AI generated Mask"
                className="dright"
                classButtonName="mini" >

                <button className="fullWidth textLeft" 
                    title="Very Precise. Does not need any adjustments."
                    onClick={ ()=>defOnRate(5) }>
                    <FontAwesomeIcon icon={faFaceSmile} /><NBSP/>
                    { "Perfect" }</button>

                <button className="fullWidth textLeft" 
                    title="Could be better but it is good enough."
                    onClick={ ()=>defOnRate(4) }>
                    <FontAwesomeIcon icon={faFaceMeh} /><NBSP/> 
                    { "Acceptable" }</button> 

                <button className="fullWidth textLeft" 
                    title="Very inccurate. Misses big parts of detected object or covers area that does not contain the object."
                    onClick={ ()=>defOnRate(2) }>
                    <FontAwesomeIcon icon={faFaceFrown} /><NBSP/>
                    { "Bad" }</button>

                <button className="fullWidth textLeft"  
                    style={{minWidth:'130px'}}
                    title="It does cont contain any part of detected object (face,eye,...)"
                    onClick={ ()=>defOnRate(1) }>
                    <FontAwesomeIcon icon={faCircleExclamation} /><NBSP/>
                    { "Unacceptable" }</button>

            </ButtonDropdown>
            :null 
        }

        {/* TRASH */}
        { props.deletable?
            <button 
                className={ 
                    "mini trash" 
                    // + (props.deletable?"":" hidden") 
                    + (props.emp? " emp":"")
                    + (props.disabled? " disabled":"")
                } 
                disabled={ !props.deletable || props.disabled } 
            >
                <FontAwesomeIcon icon={ faTrash } />
            </button> 
            :null
        }
        </div>
	)
} 
// ------------------------------------------------------------------------
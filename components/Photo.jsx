import { Link } from "@remix-run/react";
import { useEffect, useState } from "react"; 
import StarRating from "~/components/StarRating"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { addSlash } from '~/utils/utils.js'

// ------------------------------------------------------------------------
// PROPS: 
//  photo{ id, name, url, rating, (version)  }
//  mini: bool - mini version (smaller)
//  fadeDelay: (int) (def:0) fadeIn delay in ms 
export default function Photo({ photo, mini=false, fadeDelay=0 })
{
	const [fadeIn, setFadeIn] = useState( false )   
  
	useEffect(() => { 
        setTimeout(	()=>setFadeIn(true), fadeDelay )
	}, [] )   	// on first mount only
   
	return (
        <div 
            className={ "photo" + (mini?" mini":"") }
            title={ photo.name } 
            style={{ opacity: fadeIn ? 1.0 : 0.0 }} >

            <div className="actions">
                <Link to={ "/photos/edit/"+photo.id } title="Edit" >
                    <FontAwesomeIcon icon={ faPenToSquare } />
                </Link> 
            </div>		

            { mini
                ?null
                :<StarRating 
                    readOnly={true}
                    rating={ photo.rating } 
                    onChange={ nr=>{ photo.rating=nr }}/>
            }

            <Link to={ '/photos/'+photo.id }  >		 
                <img  
                    src={ addSlash(photo.url) + "mini.jpg"+ ("version" in photo ? "?v="+photo.version :"") }  
                    alt={ photo.name } />
            </Link>
		</div>
	)
}
// ------------------------------------------------------------------------
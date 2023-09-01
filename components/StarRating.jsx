import { useState } from "react"
// ------------------------------------------------------------------------
// double click same star sets rating to zero
// PROPS:
//   onChange( newRating ) -> called on rating change
//   stars [int][1:n] num of stars (max rating) (def:5)
//   rating [int][0:stars] current rating (visible stars) (value sent in POST reqest)
//   readOnly: (optional) bool (def:true)
export default function StarRating( props ) 
{ 
	const [rating, setRating] = useState( props.rating )
    // const rating = props.rating

	const num_stars = props.stars || 5
	const starArr = [] 
    
	for( let s=0; s<num_stars; s++ )
		starArr.push( s )
 
	return( 
		<div className="starsRating" > 
		{ 
			starArr.map(( s ) => ( 
				<div 
					key={ s }
					onClick={ ( props.readOnly )? null: () => 
                    {
                        const newRating = (rating==(s+1))? 0: s+1
                        setRating( newRating ) 
                        
                        if( typeof props.onChange == "function" )
                            props.onChange( newRating )
                    }} 
					className={ "star star_" + (s < rating? 1: 0) +  (props.readOnly? " readOnly":"")  }
				> 
				</div> )) 
		} 
		</div>
	)
}
// ------------------------------------------------------------------------
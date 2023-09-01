// ------------------------------------------------------------------------
// PROPS:
// visible (bool) def false
// progress (float) [0:1] def 0
export default function ProgressBar({ visible, progress })
{
    if( progress === undefined ) progress=0.0
    if( visible === undefined ) visible=false

	return (
        <div id="progressBar" style={{ visibility: visible?"visible":"hidden" }}>
            <div className="inner" style={{ width: Math.max(0.0, progress*100.0)+"%" }}></div>
        </div> 
    )
}  
// ------------------------------------------------------------------------
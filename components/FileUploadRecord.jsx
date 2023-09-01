import { useEffect, useState, useRef } from "react"; 
import { fileSizeToStr } from "~/utils/utils"
import Photo from "~/components/Photo"  
// ------------------------------------------------------------------------
// PROPS:  
//   doUpload( inputFile, onResolve, onReject )
export default function FileUploadRecord({ doUpload })
{
	const [uploadDeatils, setUploadDeatils] = useState( "" )  
    const [fileDescr, setFileDescr]=useState("")
    const [pbStarted, setPbStarted]=useState(false)
    const inputFile = useRef() 
  
	useEffect(() => {  
        inputFile.current.click()
	}, [] )   	// on first mount only

    // sart progressbar after file picked and upload started
	useEffect(() => { 
        if( uploadDeatils!="" && fileDescr!="" )
            setPbStarted(true)
     }, [uploadDeatils, fileDescr])
 
    function handleChange(e)
    {
        if( e.target.files.length > 0 )
            setFileDescr( e.target.files[0].name + " ["+fileSizeToStr(e.target.files[0].size)+"]" )
            
        if( typeof doUpload==="function" )
        {
            setUploadDeatils("uploading...")
            doUpload( 
                e.target,
                // onResolve    
                (photoData)=>{  
                    setUploadDeatils(<Photo 
                        mini={true}
                        photo={{
                            id: photoData.photoId, 
                            name: photoData.imgName, 
                            url: photoData.photoDirURL, 
                    }} />) 
                }, 
                // onReject
                ()=>{  
                    setUploadDeatils("failed")
                }
            )
        }
    }

	return (
        <>
            <input 
                ref={ inputFile } 
                type="file" 
                style={{display:"none"}}
                onChange={ e=>handleChange(e) }
            /> 	 
            { fileDescr!="" 
                ?<div className={"record fake_progress_anim" + (pbStarted!=""?" go":"")} >
                    <div className="right">{ uploadDeatils }</div>
                    { fileDescr }
                    <div className="clear"></div>
                </div>
                :null
            }
		</>
	)
}
// ------------------------------------------------------------------------
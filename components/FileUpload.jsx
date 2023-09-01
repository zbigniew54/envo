import { useState } from "react"; 
import FileUploadRecord from "~/components/FileUploadRecord"
/* ------------------------------------------------------------------------ 
	FILE UPLOAD 
        opens file upload dialog, and upload file to PY server

    PROPS:  
        doUpload( inputFile, onResolve, onReject )
// -----------------------------------------------------------------------*/ 
export default function FileUpload({ doUpload, label, children })
{ 
    const [uploads,setUploads] = useState([])
    
	return (<> 
        <button
            className="big"
            onClick={ (e)=>setUploads( p=>[...p,""]) } >
            { label }
        </button>    
        { children }
        {
            uploads.map((e,i)=><FileUploadRecord 
                key={i} 
                doUpload={ doUpload } />) 
        }
    </>)
}
// ------------------------------------------------------------------------
import { Link } from "@remix-run/react"; 
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

import ButtonDropdown from "~/components/ButtonDropdown"  
import FormPost from "~/components/FormPost"  
// ------------------------------------------------------------------------ 
// PROPS:
// loggedIn - (bool) if true -> show link, false -> hide links (show logo only)
export default function TopBar(props)
{
    // console.log( 'TopBar', props.loggedIn ) 
    return (
	  <header className={ props.loggedIn?'':'emp' }> 
        { props.loggedIn!==false? 
            <nav>
                <ButtonDropdown disabled={ false } 
                    icon={ faCircleUser }   
                    className="displayInlineBlock" 
                    classNameButton="icon" 
                    hint="User"
                > 
                    {/* <button className="fullWidth">Profile</button> 
                    <button className="fullWidth">Settings</button>  */}
                    <FormPost 
                        label="Logout"
                        route="/"
                        name="logout" 
                        value="1" 
                        className="fullWidth" 
                    ></FormPost>
                </ButtonDropdown>
 
                <Link to="/photos" title="Browse photos and albums">Browse</Link>
                <Link to="/photos/upload" title="Add photos">Upload</Link>
                {/* <Link to="/photos/import">Import</Link>
                <Link to="/photos/export">Export</Link> */}
            </nav>
            : 
            <nav>
                <Link to="/login" title="Sign in">Login</Link>
                <Link to="/register" title="Create account">Register</Link>
            </nav> 
        }
	  </header> 
    )
}
// ------------------------------------------------------------------------ 
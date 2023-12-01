import { useEffect } from "react"
import { Link } from "react-router-dom"

import { saveSession } from "../../script/session"

export const WelcomePage: React.FC = () => {
    useEffect(()=>{
      saveSession(null)
    }, [])

    return (      
      <div className="page page-welcome page-welcome--background-image text--light">
        <img className="image" src="/svg/background_2.svg" alt=""></img>
  
        <div className="border">
          <div className="header-welcome header-welcome--image">
            <h1 className="heading-welcome">Hello!</h1>
            <div className="sub-heading-welcome">Welcome to bank app
            </div>
          </div>
        </div>
    
        <div className="actions">
            <Link className="button" to="/signup">Sign Up</Link>
            <Link className="button button--light" to="/signin">Sign In</Link>
        </div>
      </div>
    );
}
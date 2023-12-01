import { Session } from "../../../back/src/class/session"

export const SESSION_KEY = "sessionAuth"

declare global {
    interface Window {
        session: Session | null
    }
}

export const saveSession = (session: Session | null) => {
    try {
        window.session = session
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } catch(error) {
        console.log(error)
        window.session = null
    }
}

export const getSessionToken = () => {
    try {
      const session = getSession()

      console.log(session, "session")
      return session ? session.token : null
    } catch (error) {
      return null
    }
  }

export const getSession = () => {
    try {
        const jsonData = localStorage.getItem(SESSION_KEY)
  
        return jsonData ? JSON.parse(jsonData) : window.session || null
    } catch (error) {
      return null
    }
  }
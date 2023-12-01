import "./index.scss";

import { useContext, useEffect, useRef, useState, useCallback, useReducer } from "react";

import { AUTH_ACTION_TYPE, AuthContext } from "../../App";

import { Form, STATUS, REG_EXP_EMAIL, REG_EXP_PASSWORD, FIELD_ERROR } from '../../script/form'
  
import { saveSession } from '../../script/session'

import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../balance";

import { BackButton } from "../../component/back-button";
import { Field } from "../../component/field";
import { FieldPassword } from "../../component/field-password";
import { LoaderTop, Alert } from "../../component/load"
import { AlertSkeleton } from "../../component/load"
import { toggleButton } from "../../container/util/toggleButton";

enum SettingsChangeEmailFields {
  EMAIL = "email",
  PASSWORD = "password",
}

enum SettingsChangePasswordFields {
  OLD_PASSWORD = "oldPassword",
  NEW_PASSWORD = "newPassword",
}

class SettingsChangeEmailForm extends Form {
  fieldNames = {
    email: SettingsChangeEmailFields.EMAIL,
    password: SettingsChangeEmailFields.PASSWORD,
  }

  validate(value: string, name: SettingsChangeEmailFields) {
    if (value === undefined) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value !== undefined && value.length < 1) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value.length > 30) {
        return FIELD_ERROR.IS_BIG
    }

    if (name === SettingsChangeEmailFields.EMAIL) {
        if (!REG_EXP_EMAIL.test(value)) {
        return FIELD_ERROR.EMAIL
        }
    }
  }

  setError = (name: any, error?: FIELD_ERROR) => {
    const span = document.querySelector(
    `.field__error#${name}`,) as HTMLSpanElement

    const field = document.querySelector(
    `.validation[name="${name}"]`,
    )

    let label: HTMLElement;

    if (name === SettingsChangeEmailFields.PASSWORD) {
      label = document.getElementById('label-password') as HTMLElement
    } else {
      label = field?.previousElementSibling as HTMLElement
    }

    if (span) {
      span.classList.toggle(
        'field__error--active',
        Boolean(error),
      )

      span.innerText = error || ''
    }

    if (field) {
      field.classList.toggle(
        'validation--active',
        Boolean(error),
      )
    }

    if (label) {
      label.classList.toggle('field__label--error', Boolean(error))
    }

    let iconElement = field?.nextElementSibling

    if (name === SettingsChangeEmailFields.PASSWORD) {
      if (iconElement?.className === 'field__icon') {
        iconElement?.classList.toggle('field__icon--error-show', Boolean(error))
      }

      if (iconElement?.classList.contains('field__icon--error-show')) {
        iconElement?.classList.toggle('field__icon--error-show', Boolean(error))
      }

      if (iconElement?.classList.contains('field__icon--hidden')) {
        iconElement?.classList.toggle('field__icon--hidden', !Boolean(error))
        iconElement?.classList.toggle('field__icon--error-hide', Boolean(error))
      }

      if (iconElement?.classList.contains('field__icon--error-hide')) {
        iconElement?.classList.toggle('field__icon--hidden', !Boolean(error))
        iconElement?.classList.toggle('field__icon--error-hide', Boolean(error))
      }
    }   
  }
 
  submit = async (email: string) => {
      if (this.disabled === true) {
        this.validateAll()
      } else {
          console.log(this.value)
          this.setAlert(STATUS.IN_PROGRESS, 'Loading...', 'email')
          toggleButton("back-button", true);
          toggleButton("button", true);
    
          try {
            const res = await fetch(`http://localhost:4000/settings-change-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: this.convertData(email),
            })
    
            const data = await res.json()
    
            if (res.ok) {
              this.setAlert(STATUS.SUCCESS, data.message, 'email');
              saveSession(data.session)
              toggleButton("back-button", false);
			        toggleButton("button", false);

              return data.session;
            } else {
              this.setAlert(STATUS.ERROR, data.message, 'email')
              toggleButton("back-button", false);
			        toggleButton("button", false);
            }
          } catch (error: any) {
              this.setAlert(STATUS.ERROR, error.message, 'email')
              toggleButton("back-button", false);
			        toggleButton("button", false);
          }
      }
  }
  
  convertData = (email: string) => {
    return JSON.stringify({
      oldEmail: email,
      newEmail: this.value[SettingsChangeEmailFields.EMAIL],
      [SettingsChangeEmailFields.PASSWORD]:
        this.value[SettingsChangeEmailFields.PASSWORD],
    })
  }
}
  
declare global {
  interface Window {
    settingsChangeEmailForm: SettingsChangeEmailForm
    settingsChangePasswordForm: SettingsChangePasswordForm
  }
}

window.settingsChangeEmailForm = new SettingsChangeEmailForm()

class SettingsChangePasswordForm extends Form {
  fieldNames = {
    oldPassword: SettingsChangePasswordFields.OLD_PASSWORD,
    newPassword: SettingsChangePasswordFields.NEW_PASSWORD,
  }

  validate(value: string, name: SettingsChangePasswordFields) {
    if (value === undefined) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value !== undefined && value.length < 1) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value.length > 30) {
        return FIELD_ERROR.IS_BIG
    }

    if (name === SettingsChangePasswordFields.NEW_PASSWORD) {
      if (!REG_EXP_PASSWORD.test(value)) {
          return FIELD_ERROR.PASSWORD
      }
    }
  }

  setError = (name: any, error?: FIELD_ERROR) => {
    const span = document.querySelector(
    `.field__error#${name}`,) as HTMLSpanElement

    const field = document.querySelector(
    `.validation[name="${name}"]`,
    )

    let label: any = null;

    if (name === SettingsChangePasswordFields.OLD_PASSWORD) 
      label = document.getElementById('label-old-password') as HTMLElement
    
    if (name === SettingsChangePasswordFields.NEW_PASSWORD) 
      label = document.getElementById('label-new-password') as HTMLElement

    if (span) {
      span.classList.toggle(
        'field__error--active',
        Boolean(error),
      )

      span.innerText = error || ''
    }

    if (field) {
      field.classList.toggle(
        'validation--active',
        Boolean(error),
      )
    }

    if (label) {
      label.classList.toggle('field__label--error', Boolean(error))
    }

    let iconElement = field?.nextElementSibling

    if (iconElement?.className === 'field__icon') {
        iconElement?.classList.toggle('field__icon--error-show', Boolean(error))
    }

    if (iconElement?.classList.contains('field__icon--error-show')) {
      iconElement?.classList.toggle('field__icon--error-show', Boolean(error))
    }

    if (iconElement?.classList.contains('field__icon--hidden')) {
      iconElement?.classList.toggle('field__icon--hidden', !Boolean(error))
      iconElement?.classList.toggle('field__icon--error-hide', Boolean(error))
    }

    if (iconElement?.classList.contains('field__icon--error-hide')) {
      iconElement?.classList.toggle('field__icon--hidden', !Boolean(error))
      iconElement?.classList.toggle('field__icon--error-hide', Boolean(error))
    }
  }
  
  submit = async (email: string) => {
      if (this.disabled === true) {
        this.validateAll()
      } else {
          console.log(this.value)
          this.setAlert(STATUS.IN_PROGRESS, 'Loading...', 'password')
          toggleButton("back-button", true);
          toggleButton("button", true);
    
          try {
            const res = await fetch(`http://localhost:4000/settings-change-password`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: this.convertData(email),
            })
    
            const data = await res.json()
    
            if (res.ok) {
              this.setAlert(STATUS.SUCCESS, data.message, 'password');
              saveSession(data.session)
              toggleButton("back-button", false);
			        toggleButton("button", false);

              return data.session;
            } else {
                this.setAlert(STATUS.ERROR, data.message, 'password')
                toggleButton("back-button", false);
                toggleButton("button", false);
            }
          } catch (error: any) {
              this.setAlert(STATUS.ERROR, error.message, 'password')
              toggleButton("back-button", false);
              toggleButton("button", false);
          }
      }
  }
  
  convertData = (email: string) => {
    return JSON.stringify({
      email: email,
      newPassword: this.value[SettingsChangePasswordFields.NEW_PASSWORD],
      oldPassword: this.value[SettingsChangePasswordFields.OLD_PASSWORD],
    })
  }
}

window.settingsChangePasswordForm = new SettingsChangePasswordForm()

export const SettingsPage: React.FC = () => {
  useEffect(()=> {
    window.settingsChangeEmailForm.value=[]
    window.settingsChangeEmailForm.error=[]
    window.settingsChangeEmailForm.disabled=true

    window.settingsChangePasswordForm.value=[]
    window.settingsChangePasswordForm.error=[]
    window.settingsChangePasswordForm.disabled=true
  }, [])

  const [state, dispatch] = useReducer(requestReducer, requestInitialState)

  const auth = useContext(AuthContext)

  const handleChangeEmailClick = async () => {

    if (auth?.state.user?.email) {
      const session = await window.settingsChangeEmailForm.submit(auth?.state.user?.email).then((res) => res)

      if (session) {
        const user = {
          email: session.user.email,
          isConfirm: session.user.isConfirm,
          id: session.user.id,
        }
        
        if (user) {
          auth.dispatch({
            type: AUTH_ACTION_TYPE.LOGIN,
            token: session.token,
            user: user,
          })
        }  
      }
    }
  }
  
  const handleChangePasswordClick = async () => {

    if (auth?.state.user?.email) {
      const session = await window.settingsChangePasswordForm.submit(auth?.state.user?.email).then((res)=>res)

      if (session) {
        const user = {
          email: session.user.email,
          isConfirm: session.user.isConfirm,
          id: session.user.id,
        }

        if (user) {
          auth.dispatch({
            type: AUTH_ACTION_TYPE.LOGIN,
            token: session.token,
            user: user,
          })
        }  
      }
    }
  }

  const scrollRef = useRef(null)

  const convertLogoutData = useCallback(
    (email: string) => {
      return JSON.stringify({
        email: email
      });
    }, []
  )

  const [isAlert, setAlert] = useState(false)

  const sendLogoutData = useCallback(
    async (email: string) => {
      dispatch({type: REQUEST_ACTION_TYPE.PROGRESS})
      toggleButton("back-button", true);
      toggleButton("button", true);
      setAlert(!isAlert)

      try {
        const res = await fetch("http://localhost:4000/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: convertLogoutData(email),
        });

        const data = await res.json();

        if (res.ok) {
          dispatch({
            type: REQUEST_ACTION_TYPE.SUCCESS,
            payload: data,
          });

          saveSession(null)         
          auth?.dispatch({type: AUTH_ACTION_TYPE.LOGOUT})
        } else {
            setAlert(!isAlert)
            toggleButton("back-button", false);
			      toggleButton("button", false);        
            dispatch({
              type: REQUEST_ACTION_TYPE.ERROR,
              payload: data.message
            })
        }  
      } catch(error: any) {        
          setAlert(!isAlert)
          toggleButton("back-button", false);
          toggleButton("button", false);  
          dispatch({
            type: REQUEST_ACTION_TYPE.ERROR,
            payload: error.message,
          })
      }
    }, [auth, convertLogoutData, isAlert]
  )

  const handleLogoutClick = useCallback(() => {
    if (auth?.state.user?.email) {
      return sendLogoutData(auth?.state.user?.email)
    }
  }, [auth, sendLogoutData])

  useEffect(()=>{
    let scrollElem = scrollRef.current as HTMLElement | null

    if (isAlert === true && scrollElem) {
      scrollElem.scrollTo(0, scrollElem.scrollHeight)
    }
  }, [isAlert])

  return (
    <div className="page page-base">
      { state.status === REQUEST_ACTION_TYPE.PROGRESS && (
        <LoaderTop />
      )}

      <div className="page-transaction__content">

        <div className="page-transaction__header">
          <span className="header__action">
            <BackButton />
          </span>
          <span className="header__text">Settings</span>
        </div>

        <div className="container container--long" ref={scrollRef}>
          <div className="page-settings__block">

            <div className="page__content__section">
              <div className="form form--small-gap">
                <h3>Change email</h3>
                <div className="form__item">
                    <Field action={window.settingsChangeEmailForm.doubleFormChange} name={SettingsChangeEmailFields.EMAIL} type="email" label="Email" placeholder="Type new email here..." buttonName="button--email" alertId = "alert-email"/>
                    <span className="field__error" id="email" ></span>
                </div>

                <div className="form__item">
                    <FieldPassword action={window.settingsChangeEmailForm.doubleFormChange} name={SettingsChangeEmailFields.PASSWORD} type="password" label="Password" placeholder="Type your password here..." buttonName="button--email" alertId = "alert-email"/>
                    <span className="field__error" id="password"></span>
                </div>

                <button onClick={handleChangeEmailClick} className="button button--light button--email button--disabled">Save Email</button>
              </div>

              <div className="alert alert--disabled" id="alert-email">
                <span className="alert__image"></span>
                <span className="alert__text"></span>
              </div>
            </div>

            <div className="divider"/>

            <div className="page__content__section">
              <div className="form form--small-gap">
                <h3>Change password</h3>

                <div className="form__item">
                    <FieldPassword action={window.settingsChangePasswordForm.doubleFormChange} name={SettingsChangePasswordFields.OLD_PASSWORD} type="password" label="Old Password" labelId="label-old-password" placeholder="Type your current password here..." buttonName="button--password" alertId="alert-password"/>
                    <span className="field__error" id="oldPassword"></span>
                </div>

                <div className="form__item">
                    <FieldPassword action={window.settingsChangePasswordForm.doubleFormChange} name={SettingsChangePasswordFields.NEW_PASSWORD} type="password" label="New Password" labelId="label-new-password" placeholder="Type your new password here..." buttonName="button--password" alertId="alert-password"/>
                    <span className="field__error" id="newPassword"></span>
                </div>

                <button onClick={handleChangePasswordClick} className="button button--light button--password button--disabled">Save Password</button>

              </div>

              <div className="alert alert--disabled" id="alert-password">
                <span className="alert__image"></span>
                <span className="alert__text"></span>
              </div>
            </div>

            <div className="divider"/>

            <div className="form form--small-gap">
              <button onClick={handleLogoutClick} className="button button--logout button--red">Log out</button>

              { state.status === REQUEST_ACTION_TYPE.PROGRESS && (
                  <AlertSkeleton/>
              )}

              { state.status === REQUEST_ACTION_TYPE.ERROR && (
                <Alert className="list-alert--no-margin" message={state.message} status={state.status}/>
              )}

              { state.status === REQUEST_ACTION_TYPE.SUCCESS && (
                <Alert className="list-alert--no-margin" message={state.data.message} status={state.status}/>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AUTH_ACTION_TYPE, AuthContext } from "../../App";

import { BackButton } from "../../component/back-button";
import { Field } from "../../component/field";
import { FieldPassword } from "../../component/field-password";

import { Form, STATUS, REG_EXP_EMAIL, REG_EXP_PASSWORD, FIELD_ERROR } from '../../script/form'
  
import { saveSession } from '../../script/session'

import { toggleButton } from "../../container/util/toggleButton";

export enum SignupFields {
  EMAIL = "email",
  PASSWORD = "password",
}
  
class SignupForm extends Form {
  fieldNames = {
    email: SignupFields.EMAIL,
    password: SignupFields.PASSWORD,
  }

  validate(value: string, name: SignupFields) {
    if (value === undefined) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value !== undefined && value.length < 1) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value.length > 30) {
        return FIELD_ERROR.IS_BIG
    }

    if (name === SignupFields.EMAIL) {
        if (!REG_EXP_EMAIL.test(value)) {
        return FIELD_ERROR.EMAIL
        }
    }

    if (name === SignupFields.PASSWORD) {
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

    let label: HTMLElement;

    if (name === SignupFields.PASSWORD) {
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

    if (name === SignupFields.PASSWORD) {
      iconElement?.classList.toggle("field__icon--error-show", Boolean(error))

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
  
  submit = async () => {
    if (this.disabled === true) {
      this.validateAll()
    } else {
        this.setAlert(STATUS.IN_PROGRESS, 'Loading...')
        toggleButton("back-button", true);
        toggleButton("button", true);

        try {
          const res = await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: this.convertData(),
          })

          const data = await res.json()

          if (res.ok) {
            this.setAlert(STATUS.SUCCESS, data.message);
            saveSession(data.session)
            return data.session;
          } else {
              this.setAlert(STATUS.ERROR, data.message)
              toggleButton("back-button", false);
              toggleButton("button", false);
          }
        } catch (error: any) {
            this.setAlert(STATUS.ERROR, error.message)
            toggleButton("back-button", false);
            toggleButton("button", false);
        }
    }
  }
  
  convertData = () => {
    return JSON.stringify({
      [SignupFields.EMAIL]:
        this.value[SignupFields.EMAIL],
      [SignupFields.PASSWORD]:
        this.value[SignupFields.PASSWORD],
    })
  }
}
  
declare global {
  interface Window {
    signupForm: SignupForm
  }
}

window.signupForm = new SignupForm()

export const SignupPage: React.FC = () => {

  const navigate = useNavigate()

  const auth = useContext(AuthContext)

  const handleSignupClick = async () => {
    const session = await window.signupForm.submit().then((result)=>result)

    if (session && session.user) {
      const user = {
          email: session.user.email,
          isConfirm: session.user.isConfirm,
          id: session.user.id,
      }

      if (auth) {
        auth.dispatch({
          type: AUTH_ACTION_TYPE.LOGIN,
          token: session.token,
          user: user
        })
      }
        
      return navigate("/signup-confirm")
    }
  }

  return (
    <div className="page page-base">
      <div className="page__content">

        <BackButton />

        <div className="page__content__top">
          <div className="header-base">
            <h2 className="heading-base">Sign up</h2>
            <div className="sub-heading-base">Choose a registration method</div>
          </div>

          <div className="page__content__section">
            <div className="form">
              <div className="form__item">
                  <Field action={window.signupForm.change} name={SignupFields.EMAIL} type="email" label="Email" placeholder="Type your email here..." />
                  <span className="field__error" id="email"></span>
              </div>

              <div className="form__item">
                  <FieldPassword action={window.signupForm.change} name={SignupFields.PASSWORD} type="password" label="Password" placeholder="Type your password here..." />
                  <span className="field__error" id="password"></span>
              </div>
            </div>

            <span className="link__prefix">Already have an account? <Link to="/signin" className="link">Sign In</Link> 
            </span>

            <button onClick={handleSignupClick} className="button button--disabled">Continue</button>

            <div className="alert alert--disabled">
              <span className="alert__image"></span>
              <span className="alert__text"></span>
            </div>

          </div>
        </div>
      </div>
  </div>

  );
}
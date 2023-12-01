import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext, AUTH_ACTION_TYPE } from "../../App";

import { toggleButton } from "../../container/util/toggleButton";

import { BackButton } from "../../component/back-button";
import { Field } from "../../component/field";

import { Form, STATUS, FIELD_ERROR } from '../../script/form';
import { getSessionToken, saveSession } from '../../script/session';

enum SignupConfirmFields  {
  CODE = "code",
}
 
export class SignupConfirmForm extends Form {
  fieldNames = {
    code: SignupConfirmFields.CODE,
  }

  validate(value: string) {
    if (value === undefined) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value !== undefined && value.length < 1) {
        return FIELD_ERROR.IS_EMPTY
    }
  }
  
  setError = (name: any, error?: FIELD_ERROR) => {
    const span = document.querySelector(
      `.field__error#${name}`,) as HTMLSpanElement
  
    const field = document.querySelector(
      `.validation[name="${name}"]`,
    )
  
    const label = field?.previousElementSibling as HTMLElement
  
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
  }

  submit = async () => {
    if (this.disabled === true) {
      this.validateAll()
      } else {
          console.log(this.value)

          this.setAlert(STATUS.IN_PROGRESS, 'Loading...')
          toggleButton("back-button", true);
          toggleButton("button", true);
  
          try {
            const res = await fetch('http://localhost:4000/signup-confirm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: this.convertData(),
            })
    
            const data = await res.json()
    
            if (res.ok) {
              this.setAlert(STATUS.SUCCESS, data.message);
              saveSession(data.session);
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
        [SignupConfirmFields.CODE]:
          this.value[SignupConfirmFields.CODE],
          token: getSessionToken(),
      })
    }
  }
  
declare global {
  interface Window {
    signupConfirmForm: SignupConfirmForm
  }
}

window.signupConfirmForm = new SignupConfirmForm()

export const SignupConfirmPage: React.FC = () => {

  const auth = useContext(AuthContext);

  console.log("state from SignupConfirmPage", auth);

  if (auth?.state.user) {
    if(auth?.state.user.isConfirm === true) return <Navigate to="/balance" />
  }

  const handleSignupConfirmClick = async () => {
    const session = await window.signupConfirmForm.submit().then((result) => result)

    if (session) {  
      const user = {
        email: session.user.email,
        isConfirm: session.user.isConfirm,
        id: session.user.id,
      }

      auth?.dispatch({
        type: AUTH_ACTION_TYPE.LOGIN,
        token: session.token,
        user: user
      })
    }
  }

  return (
    <div className="page page-base">
      <div className="page__content">
        <BackButton />
   
        <div className="page__content__top">
          <div className="header-base">
            <h2 className="heading-base">Confirm account</h2>
            <div className="sub-heading-base">Write the code you have received</div>
          </div>

          <div className="page__content__section">
            <div className="form">
              <div className="form__item">
                  <Field action={window.signupConfirmForm.change} name={SignupConfirmFields.CODE} type="text" label="Code" placeholder="" />
                  <span className="field__error" id="code"></span>
              </div>
            </div>

            <button onClick={handleSignupConfirmClick} className="button button--disabled">Confirm</button>

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
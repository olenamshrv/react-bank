import { useContext }  from "react";

import { AUTH_ACTION_TYPE, AuthContext } from "../../App";

import { BackButton } from "../../component/back-button";
import { Field } from "../../component/field";
import { FieldPassword } from "../../component/field-password";

import { Form, FIELD_ERROR, REG_EXP_PASSWORD, STATUS } from "../../script/form"

import { saveSession } from '../../script/session'

import { toggleButton } from "../../container/util/toggleButton";

enum RecoveryConfirmFields {
  CODE = "code",
  PASSWORD = "password",
}
  
export class RecoveryConfirmForm extends Form {
  fieldNames = {
    code: RecoveryConfirmFields.CODE,
    newPassword: RecoveryConfirmFields.PASSWORD,
  }
  
  validate(value: string, name: RecoveryConfirmFields) {
    if (value === undefined) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value !== undefined && value.length < 1) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value.length > 30) {
        return FIELD_ERROR.IS_BIG
    }

    if (name === RecoveryConfirmFields.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(value)) {
          return FIELD_ERROR.PASSWORD
      }
    }
  }

  setError = (name: RecoveryConfirmFields, error?: FIELD_ERROR) => {
    const span = document.querySelector(
    `.field__error#${name}`) as HTMLSpanElement

    const field = document.querySelector(
    `.validation[name="${name}"]`,
    )

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

    let label: HTMLElement;

    if (name === RecoveryConfirmFields.PASSWORD) {
      label = document.getElementById('label-password') as HTMLElement
    } else {
      label = field?.previousElementSibling as HTMLElement
    }

    if (label) {
      label.classList.toggle('field__label--error', Boolean(error))
    }

    let iconElement = field?.nextElementSibling

    if (name === RecoveryConfirmFields.PASSWORD) {
      iconElement?.classList.toggle("field__icon--error-show", Boolean(error))
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
          const res = await fetch('http://localhost:4000/recovery-confirm', {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },
            body: this.convertData(),
          })

          const data = await res.json()

          if (res.ok) {
            this.setAlert(STATUS.SUCCESS, data.message)
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
      [RecoveryConfirmFields.CODE]:
        this.value[RecoveryConfirmFields.CODE],
      [RecoveryConfirmFields.PASSWORD]:
        this.value[RecoveryConfirmFields.PASSWORD],
    })
  }
}

declare global {
  interface Window {
    recoveryConfirmForm: RecoveryConfirmForm
  }
}

window.recoveryConfirmForm = new RecoveryConfirmForm()

export const RecoveryConfirmPage: React.FC = () => {
  const auth = useContext(AuthContext);

  const handleRecoveryConfirmClick = async () => { 
    const session = await window.recoveryConfirmForm.submit().then((res) => res)

    if (session) {
    const user = {
      email: session.user.email,
      isConfirm: session.user.isConfirm,
      id: session.user.id,
    }

    if (auth) {
      auth.dispatch({
        type: AUTH_ACTION_TYPE.LOGIN,
        token: session.token,
        user: user,
      })
    }
  }
  }

  return (
    <div className="page page-base">
      <div className="page__content">

        <BackButton />

        <div className="page__content__top">
          <div className="header-base">
            <h2 className="heading-base">Recover password</h2>
            <div className="sub-heading-base">Write the code you received</div>
          </div>

          <div className="page__content__section">
            <div className="form">
              <div className="form__item">
                  <Field action={window.recoveryConfirmForm.change} name={RecoveryConfirmFields.CODE} type="text" label="Code" placeholder="Type a code here..." />
                  <span className="field__error" id="code"></span>
              </div>

              <div className="form__item">
                  <FieldPassword action={window.recoveryConfirmForm.change} name={RecoveryConfirmFields.PASSWORD} type="password" label="New password" placeholder="Type new password here..." />
                  <span className="field__error" id="password"></span>
              </div>
            </div>
            
            <button onClick={handleRecoveryConfirmClick} className="button button--disabled">Restore password</button>

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
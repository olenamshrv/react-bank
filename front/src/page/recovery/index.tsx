import { useNavigate } from "react-router-dom";

import { BackButton } from "../../component/back-button";
import { Field } from "../../component/field";

import { toggleButton } from "../../container/util/toggleButton";

import { Form, STATUS, FIELD_ERROR, REG_EXP_EMAIL } from '../../script/form';

enum RecoveryFields  {
  EMAIL = "email",
}
 
export class RecoveryForm extends Form {

    fieldNames = {
      email: RecoveryFields.EMAIL,
    }

    validate(value: string) {
      if (value === undefined) {
          return FIELD_ERROR.IS_EMPTY
      }
  
      if (value !== undefined && value.length < 1) {
          return FIELD_ERROR.IS_EMPTY
      }

      if (value.length > 30) {
        return FIELD_ERROR.IS_BIG
      }

      console.log("value from validate", value)

      if (!REG_EXP_EMAIL.test(value)) {
          return FIELD_ERROR.EMAIL
      }  
    }
  
  setError = (name: any, error?: FIELD_ERROR) => {
    const span = document.querySelector(
      `.field__error#${name}`,) as HTMLSpanElement
  
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

    const label = field?.previousElementSibling as HTMLElement;
  
    if (label) {
      label.classList.toggle('field__label--error', Boolean(error))
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
            const res = await fetch('http://localhost:4000/recovery', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: this.convertData(),
            })
    
            const data = await res.json()
    
            if (res.ok) {
              this.setAlert(STATUS.SUCCESS, data.message);
              return true;
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
        [RecoveryFields.EMAIL]:
          this.value[RecoveryFields.EMAIL],
      })
    }
  }
  
declare global {
  interface Window {
    recoveryForm: RecoveryForm
  }
}

window.recoveryForm = new RecoveryForm()

export const RecoveryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRecoveryClick = async () => {
    const result = await window.recoveryForm.submit().then((result)=>result)

    if (result) {
      navigate("/recovery-confirm")
    }
  }

  return (
    <div className="page page-base">
      <div className="page__content">

        <BackButton />

        <div className="page__content__top">
          <div className="header-base">
            <h2 className="heading-base">Recover password</h2>
            <div className="sub-heading-base">Choose a recovery method</div>
          </div>

          <div className="page__content__section">
            <div className="form">
              <div className="form__item">
                  <Field action={window.recoveryForm.change} name={RecoveryFields.EMAIL} type="email" label="Email" placeholder="Type your email here..." />
                  <span className="field__error" id="email"></span>
              </div>
            </div>

            <button onClick={handleRecoveryClick} className="button button--disabled">Send code</button>

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
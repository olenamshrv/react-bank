import { useContext, useEffect } from "react";

import { AuthContext } from "../../App";

import { BackButton } from "../../component/back-button";
import { FieldTransaction } from "../../component/field-transaction";

import { Form, STATUS, REG_EXP_EMAIL } from "../../script/form"

import { REG_EXP_IS_NUMBER } from "../../page/receive"

import { toggleButton } from "../../container/util/toggleButton";

enum SendFields {
  EMAIL = "email",
  SUM = "sum",
}

enum FIELD_ERROR {
  IS_EMPTY = 'Please enter a value in the field.',
  IS_BIG = 'The entered value is too long.',
  EMAIL = 'Please enter a valid email address.',
  IS_NOT_NUMBER = 'The entered value is not a number.',
  EXCEEDS_MAX_VALUE = 'The entered number exceeds the allowed limit for the operation. Please correct the value.',
  NEGATIVE_AMOUNT = "The value must be positive."
}
  
export class SendForm extends Form {
  fieldNames = {
    email: SendFields.EMAIL,
    sum: SendFields.SUM,
  }
  
  validate(value: string, name: SendFields) {
    if (value === undefined) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value !== undefined && value.length < 1) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value.length > 30) {
      return FIELD_ERROR.IS_BIG
  }

    if (name === SendFields.EMAIL && !REG_EXP_EMAIL.test(value)) {
      return FIELD_ERROR.EMAIL
    }

    if (name === SendFields.SUM && !REG_EXP_IS_NUMBER.test(value)) {
      return FIELD_ERROR.IS_NOT_NUMBER
    }

    if (name === SendFields.SUM && Number(value) > 10000) {
        return FIELD_ERROR.EXCEEDS_MAX_VALUE
    }

    if (name === SendFields.SUM && Number(value) <=0) {
      return FIELD_ERROR.NEGATIVE_AMOUNT
    }
  }

  setError = (name: any, error?: FIELD_ERROR) => {
    const span = document.querySelector(
    `.field__error#${name}`,) as HTMLSpanElement

    const field = document.querySelector(
    `.validation[name="${name}"]`,
    )

    const label = field?.previousElementSibling as HTMLElement;

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
      label.classList.toggle('field-transaction__label--error', Boolean(error))
    }
  }

  submit = async (userId: number ) => {
    console.log("submit")
    if (this.disabled === true) {
      this.validateAll()
    } else {
        console.log(this.value)
        this.setAlert(STATUS.IN_PROGRESS, 'Loading...')
        toggleButton("back-button", true);
        toggleButton("button", true);

        try {
          const res = await fetch(`http://localhost:4000/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: this.convertTransactionData(userId),
          })

          const data = await res.json()

          if (res.ok) {  
            const { transactionId } = data 

            try {
              const res = await fetch(`http://localhost:4000/notifications`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: this.convertNotificationData(userId, 'Payment sent', transactionId),
              })
      
              const data = await res.json()
      
              if (res.ok) {
                
                try {
                  const res = await fetch(`http://localhost:4000/user?email=${this.value[SendFields.EMAIL]}`)
          
                  const data = await res.json()

                  const { id } = data
          
                  if (res.ok) {
                    try {
                      const res = await fetch(`http://localhost:4000/notifications`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: this.convertNotificationData(id, 'Payment received', transactionId),
                      })
              
                      const data = await res.json()
                                  
                      if (res.ok) {
                        this.setAlert(STATUS.SUCCESS, data.message)
                        toggleButton("back-button", false);
			                  toggleButton("button", false);
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

  convertTransactionData = (userId: number) => {
    console.log("email from convertdata", userId)

    return JSON.stringify({
      userId: Number(userId),
      [SendFields.EMAIL]:
      this.value[SendFields.EMAIL],
      [SendFields.SUM]:
      this.value[SendFields.SUM],
    })
  }

  convertNotificationData = (userId: number, name: string, transactionId: number | null) => {
    console.log("userId from convertTransactionData", userId)

    console.log("transactionId from convertTransactionData", transactionId)

    const d = JSON.stringify({
      name: name,
      type: "Info",
      userId: userId,
      transactionId: transactionId=== null ? null : Number(transactionId),
    })

    console.log(d, "transid")

    return JSON.stringify({
      name: name,
      type: "Info",
      userId: userId,
      transactionId: transactionId,
    })
  }

}

declare global {
  interface Window {
    sendForm: SendForm
  }
}

window.sendForm = new SendForm()


export const SendPage: React.FC = () => {
  useEffect(()=>{
    window.receiveForm.value = []
    window.receiveForm.error = []
    window.receiveForm.disabled = true
  }, [])

  const auth=useContext(AuthContext);

  console.log(auth, "auth");

  console.log("auth.state.user.email before return", auth?.state.user?.email)

  const handleClick: React.MouseEventHandler = () => { 
    console.log("handleClick")
    if (auth?.state.user?.id)
    window.sendForm.submit(auth?.state.user?.id) 
  }

  return (      
    <div className="page page-base page--grey page-transaction">
    
      <div className="page-transaction__content">
        <div className="page-transaction__header">
            <span className="header__action">
              <BackButton />
            </span>
            <span className="header__text">Send</span>
        </div>

        <div className="form"> 
          <FieldTransaction send name="email" label="Email" action={window.sendForm.change} placeholder="Please type email here..."/>
          <span className="field__error" id="email"></span>

          <FieldTransaction send name="sum" label="Sum" action={window.sendForm.change} placeholder="Please type sum here..."/>
          <span className="field__error" id="sum"></span>

          <button onClick={handleClick} className="button button--disabled" >Send</button>

          <div className="alert alert--disabled">
            <span className="alert__image"></span>
            <span className="alert__text"></span>
          </div>

        </div>
      </div>

    </div>
  );
}
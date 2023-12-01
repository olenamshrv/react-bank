import React, { lazy, Fragment, Suspense, useContext, useReducer, useCallback, useEffect  } from "react";

import { AuthContext } from "../../App";

import { requestInitialState, REQUEST_ACTION_TYPE, requestReducer } from "../../container/util/requestReducer";

import { Alert, LoaderTop, PaymentSystemItemSkeleton, TransactionFieldSkeleton } from "../../component/load";
import { BackButton } from "../../component/back-button";
import { FieldTransaction } from "../../component/field-transaction";

import { Form, STATUS } from "../../script/form"

import { toggleButton } from "../../container/util/toggleButton"

const PaymentSystemItem = lazy(() => import("../../component/ps-item"));

enum ReceiveFields {
  RECEIVE_AMOUNT = "receiveAmount",
}

enum FIELD_ERROR {
  IS_EMPTY = 'Please enter a value in the field.',
  IS_NOT_NUMBER = 'The entered value is not a number.',
  EXCEEDS_MAX_VALUE = 'The entered number exceeds the allowed limit for the operation. Please correct the value.',
  NEGATIVE_AMOUNT = "The value must be positive."
}

export const REG_EXP_IS_NUMBER= new RegExp(/^\d+\.?\d*$/, )
  
export class ReceiveForm extends Form {
  fieldNames = {
    receiveAmount: ReceiveFields.RECEIVE_AMOUNT,
  }
  
  validate(value: string, name: ReceiveFields) {
    if (value === undefined) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (value !== undefined && value.length < 1) {
        return FIELD_ERROR.IS_EMPTY
    }

    if (!REG_EXP_IS_NUMBER.test(value)) {
      return FIELD_ERROR.IS_NOT_NUMBER
    }

    if (Number(value) > 10000) {
        return FIELD_ERROR.EXCEEDS_MAX_VALUE
    }

    if (Number(value) <=0) {
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

  submit = async (userId: number, email: string | undefined, systemId: number) => {
    if (this.disabled === true) {
      this.validateAll()
    } else {
        console.log(this.value)
        this.setAlert(STATUS.IN_PROGRESS, 'Loading...')
        toggleButton("back-button", true);
        toggleButton("ps-item", true)

        try {
          const res = await fetch(`http://localhost:4000/receive`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: this.convertTransactionData(email, systemId),
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
                body: this.convertNotificationData(userId, transactionId),
              })
      
              const data = await res.json()
      
              if (res.ok) {
                this.setAlert(STATUS.SUCCESS, data.message)
                toggleButton("back-button", false);
                toggleButton("ps-item", false)
              } else {
                  this.setAlert(STATUS.ERROR, data.message)
                  toggleButton("back-button", false);
                  toggleButton("ps-item", false)
              }
            } catch (error: any) {
                this.setAlert(STATUS.ERROR, error.message)
                toggleButton("back-button", false);
                toggleButton("ps-item", false)
            }
          } else {
              this.setAlert(STATUS.ERROR, data.message)
              toggleButton("back-button", false);
              toggleButton("ps-item", false)
          }
        } catch (error: any) {
            this.setAlert(STATUS.ERROR, error.message)
            toggleButton("back-button", false);
            toggleButton("ps-item", false)
        }
    }
  }

  convertTransactionData = (email: string | undefined, systemId: number) => {

    return JSON.stringify({
      email: String(email),
      [ReceiveFields.RECEIVE_AMOUNT]:
      this.value[ReceiveFields.RECEIVE_AMOUNT],
      paymentSystemId: Number(systemId),
    })
  }

  convertNotificationData = (userId: number, transactionId: number | null) => {
    return JSON.stringify({
      name: 'Payment received',
      type: "Info",
      userId: userId,
      transactionId: transactionId,
    })
  }
}

declare global {
  interface Window {
    receiveForm: ReceiveForm
  }
}

window.receiveForm = new ReceiveForm()

export const ReceivePage: React.FC = () => {
  useEffect(()=>{
    window.receiveForm.value = []
    window.receiveForm.error = []
    window.receiveForm.disabled = true
  }, [])

  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const auth=useContext(AuthContext);

  const getData = useCallback(async () => {
    dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });
  
    try {
      const res = await fetch(`http://localhost:4000/receive`);
  
      const data = await res.json();

      if (res.ok) {
        dispatch({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: convertData(data),
        });
      } else {
        dispatch({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: data.message,
        });
      }
    } catch (error: any) {
      dispatch({
        type: REQUEST_ACTION_TYPE.ERROR,
        payload: error.message,
      });
    }
  }, []);
  
  const convertData = (raw: any) => {

    let { list }  = raw;

    list = list.map((item: any) => 
       ({ 
        id: item.id,
        name: item.name,
        logos: item.logos.map((logo: any) => (        
          `/svg/logos/${logo}.svg`
        ))
      }
    ))

    return list
  };
  
  useEffect(() => {
    getData();
  }, []);

  return (      
    <div className="page page-base page--grey page-transaction">
    
      { state.status === REQUEST_ACTION_TYPE.PROGRESS && 
        <Fragment>
          <LoaderTop />

          <div className="page-transaction__content">
                <div className="page-transaction__header">
                    <span className="header__action">
                      <BackButton />
                    </span>
                    <span className="header__text">Receive</span>
                </div>
                            
                <TransactionFieldSkeleton />

          </div>
        </Fragment>
      }

      { state.status === REQUEST_ACTION_TYPE.ERROR && (
          <Fragment>
              <div className="page-transaction__content">
                <div className="page-transaction__header">
                    <span className="header__action">
                      <BackButton />
                    </span>
                    <span className="header__text">Receive</span>
                </div>
              </div>

            <Alert status={state.status} message={state.message} />
          </Fragment>
        )
      }       

      { state.status === REQUEST_ACTION_TYPE.SUCCESS && 
        (
            <div className="page-transaction__content">
              <div className="page-transaction__header">
                  <span className="header__action">
                    <BackButton />
                  </span>
                  <span className="header__text">Receive</span>
              </div>

              <div className="form"> 
                <FieldTransaction name="receiveAmount" label="Receive amount" action={window.receiveForm.change} placeholder="$500"/>
                <span className="field__error" id="receiveAmount"></span>

                <div className="divider"></div> 

                <div className="box-transaction">
                  <span className="receive-heading">Payment system</span>

                  <div className="box-transaction">
                      { 
                         
                      state.data.map((item: any) => (
                        <Fragment key={item.id}>
                          <Suspense fallback={ <PaymentSystemItemSkeleton /> }> 
                            <PaymentSystemItem action={window.receiveForm.submit} systemId={item.id} image={`/svg/${item.name.toLowerCase()}.svg`} alt={item.name} name={item.name} 
                             logos={item.logos} email={auth?.state.user?.email} userId={auth?.state.user?.id}
                             /> 
                          </Suspense>
                        </Fragment>                
                        ))   
                    } 

                  </div>
                </div>

                <div className="alert alert--disabled">
                  <span className="alert__image"></span>
                  <span className="alert__text"></span>
                </div>

              </div>
            </div>
         )
      } 
    </div>
  );
}
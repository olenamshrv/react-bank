export const REG_EXP_EMAIL = new RegExp(
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
)
  
export const REG_EXP_PASSWORD = new RegExp(
/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
)

export enum FIELD_ERROR {
    IS_EMPTY = 'Please enter a value in the field.',
    IS_BIG = 'The entered value is too long.',
    EMAIL = 'Please enter a valid email address.',
    PASSWORD = 'The password must consist of at least 8 characters, including at least one digit, small and large letters',
}

export enum STATUS {
    IN_PROGRESS = "progress",
    SUCCESS = "success",
    ERROR = "error",
    DEFAULT = "default",
}

export abstract class Form {
    abstract fieldNames: any

    value: any = {}
    error: any = {}

    disabled: boolean = true

    abstract validate(value: string, name?: any): any

    areAllEmpty = () => {
      return Object.keys(this.value).length === 0 || Object.values(this.value).find((item: any) => item.toString().length !== 0) === undefined ? true : false
    }
  
    doubleFormChange = (name: any, value: string, buttonName="button", alertId: string) => {
      document.getElementById(`${alertId}`)?.classList.add("alert--disabled")
  
      const error = this.validate(value, name)
      this.value[name] = value
  
      const areAllEmpty = this.areAllEmpty()
  
      if (areAllEmpty === true) {
        this.error = []
        Object.values(this.fieldNames).forEach((name) => { 
          this.setError(name) }) 
      } else {
          if (error) {
            this.setError(name, error)
            this.error[name] = error
          } else {
            this.setError(name)
            delete this.error[name]
          }
      }
  
      this.checkDisabled(buttonName, areAllEmpty)
    }

    change = (name: any, value: string, buttonName="button") => {
      document.querySelector(".alert")?.classList.add("alert--disabled")

      const error = this.validate(value, name)
      this.value[name] = value

      if (error) {
        this.setError(name, error)
        this.error[name] = error
      } else {
        this.setError(name)
        delete this.error[name]
      }
  
      this.checkDisabled(buttonName)
    }
  
    abstract setError (name: any, error?: any): any
  
    checkDisabled = (buttonName: any, areAllEmpty?: boolean) => {
      let disabled = false
 
      Object.values(this.fieldNames).forEach((name: any) => {
        if (this.error[name] || this.value[name] === undefined || areAllEmpty === true) disabled = true
      })

      const el = document.querySelector(`.${buttonName}`)
 
      if (el) {
        el.classList.toggle(
          'button--disabled',
          Boolean(disabled),
        )

        if (!areAllEmpty) {
          el.toggleAttribute(
            'disabled',
            Boolean(disabled),
          )
        } else {
            el.toggleAttribute(
              'disabled',
              Boolean(!disabled),
            )
        }
      }

      this.disabled = disabled
    }
  
    validateAll = () => {
      Object.values(this.fieldNames).forEach((name: any) => { 
          console.log("validateAll")
          
            const error = this.validate(this.value[name], name)

            console.log("validateAll error", error)

            if (error) {
                this.setError(name, error)
                this.error[name] = error

                console.log('error', error, this.value, this.error)
            }
        })
    }
  
    setAlert = (status: STATUS, text?: string, alertId?: string) => {
        let alertElem: HTMLElement;

        if (alertId) {
          alertElem = document.getElementById(`alert-${alertId}`) as HTMLElement
        } else {
          alertElem = document.querySelector('.alert') as HTMLElement
        }

        const alertImageElem = alertElem.querySelector('.alert__image') as HTMLElement;
        const alertTextElem = alertElem.querySelector('.alert__text') as HTMLElement;

        if (alertElem) {
            if (status === STATUS.IN_PROGRESS || STATUS.SUCCESS || STATUS.ERROR) {
                alertElem.className = `alert alert--${status}`;
            } else {
                alertElem.className = `alert alert--disabled`
            }
        }
  
        if (text) {
          if (status === STATUS.IN_PROGRESS || STATUS.SUCCESS) {
            alertTextElem.innerText = text
            alertImageElem.classList.add("alert__image--disabled")
          }

          if (status === STATUS.ERROR) {
            alertTextElem.innerText = text
            alertImageElem.classList.remove("alert__image--disabled")
          }
        }
    }
  }
  
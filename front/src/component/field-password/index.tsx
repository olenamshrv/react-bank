import "./index.scss"

type fieldProps = {
    name: any;
    type?: string;
    label: string;
    labelId?: string;
    placeholder?: string;
    buttonName?: string;
    alertId?: string,
    action: (name: any, value: string, buttonName: string, alertId: string) => void;
}

const handleClick : React.MouseEventHandler<HTMLSpanElement> = (event) => {
    const elemIcon = event.currentTarget

    if (elemIcon.className === "field__icon" || elemIcon.classList.contains('field__icon--hidden')) 
        elemIcon.classList.toggle('field__icon--hidden')

    if (elemIcon.classList.contains('field__icon--error-show') || elemIcon.classList.contains('field__icon--error-hide')) {   
        elemIcon.classList.toggle('field__icon--error-show')
        elemIcon.classList.toggle('field__icon--error-hide')
    }

    const input = elemIcon.previousElementSibling
    const type = input?.getAttribute("type")

    if (type === "password") {
        input?.setAttribute("type", "text")
    } else input?.setAttribute("type", "password")
}

export const FieldPassword: React.FC<fieldProps> = (data: fieldProps) => {
    const {name, action, type="text", label, labelId="label-password", placeholder="", buttonName="button", alertId = ""} = {...data};

    const handleInput: React.FormEventHandler = (event) => {  
        const el = event.currentTarget as HTMLInputElement
        const value = el.value;

        action(name, value, buttonName, alertId)
    }

    return (
        <div className="field">
            <label className="field__label" id={labelId}>{label}</label>

            <div className="field__wrapper">
                <input onInput={handleInput} className="field__input validation" name={name} placeholder={placeholder} type={type} maxLength={40} />
                <span onClick={handleClick} className="field__icon"></span>
            </div>
        </div>
    );
}
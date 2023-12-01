import "./index.scss"

type fieldProps = {
    name: any;
    type?: string;
    label: string;
    placeholder?: string;
    buttonName?: string; 
    alertId?: string,
    action: (name: any, value: string, buttonName: string, alertId: string) => void
}

export const Field: React.FC<fieldProps> = (data: fieldProps) => {
    const {name, action, type="text", label, placeholder="", buttonName="button", alertId=""} = {...data};

    const handleInput: React.FormEventHandler = (event) => {   
        const el = event.currentTarget as HTMLInputElement
        const value = el.value;
        action(name, value, buttonName, alertId)
    }

    return (
        <div className="field">
            <label className="field__label">{label}</label>
            <input className="field__input validation" name={name} onInput={handleInput} placeholder={placeholder} type={type} />
        </div>
    );
}
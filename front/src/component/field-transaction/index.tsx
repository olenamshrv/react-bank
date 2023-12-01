import "./index.scss"

import { Fragment } from "react";

type fieldProps = {
    name: any;
    type?: string;
    label: string;
    placeholder?: string;
    action: (name: any, value: string) => void
    send?: boolean;
}

export const FieldTransaction: React.FC<fieldProps> = (data: fieldProps) => {
    const {name, action, type="text", label, placeholder="", send} = {...data};

    const handleInput: React.FormEventHandler = (event) => { 
        
        const el = event.currentTarget as HTMLInputElement

        const value = el.value;

        action(name, value)
    }

    return (
        <Fragment>
            { send && (
                <div className="box-transaction box-transaction--send">
                <label className="field-transaction__label--small">{label}</label>
                <input className="field-transaction__input validation" name={name} onInput={handleInput} placeholder={placeholder} type={type} />
            </div>
            )
            }

            { !send && (
                <div className="box-transaction">
                    <label className="field-transaction__label">{label}</label>
                    <input className="field-transaction__input validation" name={name} onInput={handleInput} placeholder={placeholder} type={type} />
                </div>
            )
            }
        </Fragment>
    );
}
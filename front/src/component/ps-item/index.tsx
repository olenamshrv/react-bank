import "./index.scss";

import { Fragment } from "react";

type PaymentSystemItemProps = {
    systemId: number,
    image: string,
    alt: string,
    name: string,
    logos: string[],
    email: string | undefined,
    userId: number| undefined,
    action: (userId: number, email: string | undefined, systemId: number) => {},
}

export const PaymentSystemItem: React.FC<PaymentSystemItemProps> = ({systemId, image, alt, name, logos, email, userId, action}) => {

    console.log("PaymentSystemItem", email)

    const handleClick: React.MouseEventHandler = () => {action(Number(userId), email, Number(systemId))}

    return (
        <button className="ps-item" onClick={handleClick}>
            <div className="ps-item__info">
                <img className="ps-item__icon" src={image} alt={alt} />
                <div className="ps-item__name">{name}
                </div>
            </div>
            
            <div className="ps-item__icon-set">
                { logos.map((item: any) => (
                    <Fragment key={`${systemId}"-"${item}`}> 
                         <span className="icon--small" style={{ backgroundImage: `url("${item}")` }}></span> 
                     </Fragment> 
                   )) 
                } 
            </div>
        </button>            
    );
}

export default PaymentSystemItem;
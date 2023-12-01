import "./index.scss";

import { splitNumber } from "../../container/util/splitNumber";

type ListItemProps = {
    image: string,
    alt: string,
    name: string,
    time: string,
    type: string,
    amount: number,
}

export const ListItem: React.FC<ListItemProps> = (data: ListItemProps) => {
    const { image, alt, name, time, type, amount} = {...data}

    const {intPart, decPart} = splitNumber(Number(amount), type)

    return (
        <div className="list-item">
            <div className="list-item__info">
                <img className="list-item__icon" src={image} alt={alt} />
                <div className="list-item__details">
                    <div className="list-item__heading">{name}</div>
                    <div className="list-item__bottom">
                        <span className="text--small">{time}</span>
                        <span className="period"></span>
                        <span className="text--small">{type}</span>
                    </div>
                </div>
            </div>

            { type === "Receipt" && <span className="list-item__text list-item__text--main--green">{intPart}<span className="list-item__text--secondary--green">{decPart}</span>
            </span> }

            { type === "Sending" && <span className="list-item__text list-item__text--main--dark">{intPart}<span className="list-item__text--secondary--grey">{decPart}</span>
            </span> }
        </div>
    );
}

export default ListItem;
import "./index.scss";

type NotificationItemProps = {
    icon: string,
    name: string,
    type: string,
    time: string,
}

export const NotificationItem: React.FC<NotificationItemProps> = ({icon, name, type, time}) => {

    console.log("NotificationItem", icon, name, type, time)

    return (
        <div className="notification-item">
            <div className="notification-item__info">
                <img className="notification-item__icon" src={icon} alt={type} />
                <div className="notification-item__details">
                    <div className="notification-item__heading">{name}
                    </div>
                    <div className="notification-item__bottom">
                        <span>{time}</span>
                        <span className="period"></span>
                        <span>{type}</span>
                    </div>
                </div>
            </div>
        </div>            
    );
}

export default NotificationItem;
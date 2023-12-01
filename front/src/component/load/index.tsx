import "./index.scss";

export const LOAD_STATUS = {
  PROGRESS: "progress",
  SUCCESS: "success",
  ERROR: "error",
};

interface AlertProps {
  message: string | null | undefined,
  status: "success" | "error" | "progress" | "default",
  className?: string,
}

export const Alert: React.FC<AlertProps> = (props: AlertProps) => {
  let { message, status, className=""} = props

  if (!message) message = ""

  return <div className={`list-alert list-alert--${status} ${className}`}>{message}</div>;
}

export const LoaderTop: React.FC = () => {
  return <div className="loader--top"></div>;
}

export const Loader: React.FC = () => {
  return (
    <>
      <div className="loader"></div>
      <div className="loader loader--center"></div>
      <div className="loader loader--right"></div>
    </>
  )
}

export const Skeleton: React.FC<{}> = () => {
  return (
      <div className="skeleton__item">
        <span className="skeleton__item__icon"></span>
        <div className="skeleton__item__content"></div>
      </div>
  );
}

export const ItemFieldSkeleton: React.FC<{}> = () => {
  return (
      <div className="item-field-skeleton">
        <div className="item-field-skeleton__item">
        </div>
      </div>
  )
}

export const TransactionSkeleton: React.FC<{}> = () => {
  return (   
    <div className="transaction-skeleton__heading">
    </div>
  );
}

export const PaymentSystemItemSkeleton: React.FC = () => {
return (
  <div className="payment-system-item-skeleton">
    <div className="payment-system-item-skeleton__info">
        <span className="payment-system-item-skeleton__icon"></span>
        <span className="payment-system-item-skeleton__name"></span>
    </div>
    <div className="payment-system-item-skeleton__icon-set">      
    </div>
  </div>
)
}

export const TransactionFieldSkeleton: React.FC = () => {
  return (
    <div className="transaction-field-skeleton">
      <span className="payment-system-item-skeleton__name"></span>
      <div className="transaction-field-skeleton__input"></div>
    </div>
  )
}

export const SendTransactionFieldSkeleton: React.FC = () => {
  return (
    <div className="transaction-field-skeleton transaction-field-skeleton--send">
      <span className="payment-system-item-skeleton__name payment-system-item-skeleton__name--send"></span>
      <div className="transaction-field-skeleton__input"></div>
    </div>
  )
}

export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="notification-list-skeleton">
      <div className="notification-item-skeleton"></div>
      <div className="notification-item-skeleton"></div>
      <div className="notification-item-skeleton"></div>
      <div className="notification-item-skeleton"></div>
      <div className="notification-item-skeleton"></div>
      <div className="notification-item-skeleton"></div>
      <div className="notification-item-skeleton"></div>
      <div className="notification-item-skeleton"></div>
    </div>
  )
}

export const AlertSkeleton: React.FC = () => {
  return <div className="alert-skeleton"></div>
}


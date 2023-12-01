export interface ItemFieldProps {
    name: string,
    value: string,
}

export const ItemField: React.FC<ItemFieldProps> = ({name, value}) => {
    return (
        <div className="transaction-item__field">
            <span>{name}</span>
            <span>{value}</span>
        </div>
    )
}

export default ItemField;
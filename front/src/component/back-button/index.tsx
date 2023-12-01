const handleClick: React.MouseEventHandler = () => {
    window.history.back();
}

export const BackButton: React.FC = () => {
    return (
        <button className="back-button" onClick={handleClick}>
            <img src="/svg/arrow-back.svg" alt="<"/>
        </button>
    );
}
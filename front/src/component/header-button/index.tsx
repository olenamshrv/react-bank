import "./index.scss"

import { Link } from "react-router-dom";

interface headerButtonProps {
    link: string,
    image: string,
    label: string,
    alt: string,
}

export const HeaderButton: React.FC<headerButtonProps> = (data: headerButtonProps) => {
    const {link, image, label, alt} = {...data}

    return (
        <div className="header__button">
            <div className="header__link">
                <Link to={link} className="link-button" >              
                    <button className="link__button">
                        <img src={image} alt={alt} width="28px" height="28px" />
                    </button>
                </Link> 
            </div>
            
            <span className="link__label">{label}</span>                
        </div>
    );
}
import {useState, useEffect} from "react";
import "./topButton.css";
import vectorIcon from "../../assets/icon/Vector.svg";

const TopButton = () => {
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 50) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="topButton">
            {isVisible && (
                    <img onClick={scrollToTop} className="scrollIcon" src={vectorIcon} alt="Retour en haut" />
            )}
        </div>
    );
}

export default TopButton;
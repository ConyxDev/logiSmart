import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import "./signOut.css";
import logoutIcon from "../../assets/icon/logout 1.svg";
import {useNavigate} from "react-router-dom";

const SignOut = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Déconnexion réussie");
            navigate("/login");
            } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
            }
        };

    return (
    <img onClick={handleLogout} src={logoutIcon} className="logoutIcon"/>
    );
}

export default SignOut;
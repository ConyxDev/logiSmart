import {useState} from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/header";
import Footer from "../../components/footer";


const LoginPage = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState(null);
const navigate = useNavigate();

const hangleLogin = async (e) => {
    e.preventDefault();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(userCredential);
        navigate('/homePage');
    }
    catch (error) {
      setError(error.message);
    }
}

    return(
        <>
            <Header />
            <div>
            <div className="loginPage">
            <div className="loginPageContainer">
            <h1>Connexion</h1>
            <form onSubmit={hangleLogin}>
        <div className="input-group">
          <label htmlFor="email">Identifiant</label>
          <input type="email" id="emailLogin" placeholder="Identifiant" value={email} onChange={(e)=> setEmail(e.target.value)}/>
        </div>
        <div className="input-group">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" placeholder="Mot de passe"  value={password} onChange={(e)=> setPassword(e.target.value)}/>
        </div>

        <div className="links-container">
          <label>
            <input type="checkbox" />
            Se souvenir de moi
          </label>
          <div className="forgot-links">
            <a href="/forgot-username">Identifiant oublié ?</a>
            <a href="/forgot-password">Mot de passe oublié ?</a>
          </div>
        </div>

        <button type="submit" className="login-btn">Se connecter</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      </div>
            </div>
        </div>
        <Footer />
    </>
    )
}

export default LoginPage;
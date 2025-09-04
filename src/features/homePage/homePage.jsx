
import Footer from "../../components/footer";import HeaderDashboard from "../../components/headerDashboard";
import Navigation from "../navigation/navigation";
import "./homePage.css";
import { auth } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import { database } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import SignOut from "../../components/logout/signOut";
import FormSender from "../../components/fichePatient/linkForm";
import AppointmentList from "../../components/appointmentsList/appointmentsList";
import DailyTasks from "../../components/dailyTasks/dailyTasks";
import PatientSearch from "../../components/patientSearch/patientSearch";

const HomePage = () => {
  
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
      const fetchUserData = async () => {
        const userId = auth.currentUser?.uid;
        const userRef = ref(database, `users/${userId}`);
  
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            console.error("Aucune donnée utilisateur trouvée.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données :", error);
        }
      };
  
      fetchUserData();
    }, []);


    const handleLogout = () => {
      navigate("/login"); // Redirige vers la page de connexion
    };

    return (
        <>
            <HeaderDashboard />
            <div className="user-info">
            <p>Bienvenue {userData 
            ? `${userData.name} ${userData.firstName}` : "Chargement..."}</p>
            <img className="user-icon" src="src/assets/icon/user 1.svg"/>
            <SignOut onLogout={handleLogout} />  
            </div>
            <div className="navigation">
            <Navigation />
            </div>  
            <div className="dashboard">
            <div className="dashboard-header">
            <h1>Tableau de bord</h1>
            <img src="src/assets/icon/dashboard 1.svg" alt="notifications" />
            </div>
            <div className="dashboard-left">
            <section className="dailyappoint">
            <AppointmentList />
            </section>
            <div className="stats">
            <section className="admin-stats">
              <div className="admin-statsContainer">
            <h2>État des tâches administratives</h2>
            <img src="src/assets/icon/list 1.svg" alt="calendar" />
            </div>
            <div className="admin-statsContent">
            <p>Facturation en cours : <strong>10</strong></p>
            <p>Paiements en cours : <strong>10</strong></p>
            <p>Dossiers à finaliser : <strong>10</strong></p>
            </div>
            </section>
            <section className="daily-stats">
              <div className="daily-statsContainer">
            <h2>Statistiques du jour</h2>  
            <img src="src/assets/icon/statistics 1.svg" alt="calendar" />
            </div>
            <div className="daily-statsContent">
            <p>Nombre total de rendez-vous : <strong>10</strong></p>
            <p>Nombre de tâches à réaliser : <strong>10</strong></p>
            <p>Alertes à traiter : <strong>10</strong></p>
            </div>
            </section>
            </div>
            <section className="quickToolAccess">
            <div className="quickToolContainer">
            <h2>Accès rapide aux outils</h2>  
            <img src="src/assets/icon/tools 1.svg" alt="calendar" />
            </div>
            <div className="quickToolContent">
            <FormSender/>
            <div className="divider">
            <img src="src/assets/icon/add 1.svg" alt="ajouter un nouveau patient" />
            <p>Ajouter un nouveau patient</p>
            
            </div>
            <div className="divider">
            <img src="src/assets/icon/bill 1.svg" alt="ajouter un nouvelle facture" />
            <p>Editer une nouvelle facture</p>
            
            </div>
            <div className="divider">
            <img src="src/assets/icon/schedule 1.svg" alt="prendre un nouveau rendez-vous" />
            <p>Prendre rendez-vous</p>
            
            </div>
            <div className="divider">
            <img src="src/assets/icon/contact-info 1.svg" alt="ajouter un nouveau contact" />
            <p>Ajouter un nouveau contact</p>
            
            </div>
            </div>
            </section>
        </div>
        <div className="dashboard-right">
            <section className="todo-listContainer">
            <DailyTasks/>
            </section>
            <section className="patientSearch">
                <div className="search">
            <h2>Recherche de patients</h2> 
            <img src="src/assets/icon/quick-scan 1.svg" alt="calendar" />
                </div>
            <PatientSearch />
            </section>
            <section className="monthly-stats">
            <div className="monthly-statsContainer">
            <h2>Statistiques du mois</h2>
            <img src="src/assets/icon/statistics 1.svg" alt="calendar" />
            </div>
            <div className="monthly-statsContent">
            <p>Patients visités ce mois-ci : <strong>10</strong></p>
            <p>Interventions réalisées : <strong>10</strong></p>
            <p>Facturation totale du mois : <strong>7500.-</strong></p>
            </div>
            </section>

        </div>
        

    </div>
            <Footer />
        </>
        
    )
}

export default HomePage;

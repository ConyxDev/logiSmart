import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../../firebaseConfig";
import "./dossiers.css";
import HeaderDashboard from "../../components/headerDashboard";
import Navigation from "../navigation/navigation";
import { useNavigate } from "react-router-dom";
import SignOut from "../../components/logout/signOut";
import Footer from "../../components/footer";


const Dossiers = () => {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("lastName");
  const [activePatients, setActivePatients] = useState(true);
  /* const [todayPatients, setTodayPatients] = useState(false); */
  const [archivedPatients, setArchivedPatients] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsRef = ref(database, "patients");
        const snapshot = await get(patientsRef);
        console.log(snapshot.val());
        if (snapshot.exists()) {
          const patientData = snapshot.val();
          const patientArray = Object.keys(patientData).map((key) => ({
            id: key,
            ...patientData[key].generalInformation,
          }));
          setPatients(patientArray);
        } else {
          console.error("Aucun patient trouvé.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    if (activePatients && !patient.isArchived) return true;
    /* if (todayPatients && patient.hasTodayCare) return true; */
    if (archivedPatients && patient.isArchived) return true;
    return false;
  }).filter((patient) =>
    patient[categoryFilter]?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleLogout = () => {
    navigate("/login"); // Redirige vers la page de connexion
  };


  return (
    <>
      <HeaderDashboard />
      <div className="dossiers-navigation">
      <h2>Dossiers</h2>
      <SignOut onLogout={handleLogout} />

      </div>
      <div className="navigation">
      <Navigation />
      </div>  
      <div className="dossiersPage">
        <header className="dossiers-header">
          <p>Total patients actifs: {patients.filter((p) => !p.isArchived).length}</p>
          <button id="addPatientBtn"
          onClick={() => navigate("/add-patient")}
          >Ajouter un patient</button>
        </header>

        <div className="dossiers-filters">
          <input
            type="text"
            placeholder="Rechercher un patient"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="lastName">Nom</option>
            <option value="firstName">Prénom</option>
            <option value="dateOfBirth">Date de naissance</option>
          </select>
          <div className="checkboxes">
            <label>
              <input
                type="checkbox"
                checked={activePatients}
                onChange={() => setActivePatients(!activePatients)}
              />
              Patients actifs
            </label>
           {/*  <label>
              <input
                type="checkbox"
                checked={todayPatients}
                onChange={(e) => setTodayPatients(e.target.checked)}
              />
              Patients du jour
            </label> */}
            <label>
              <input
                type="checkbox"
                checked={archivedPatients}
                onChange={() => setArchivedPatients(!archivedPatients)}
              />
              Patients archivés
            </label>
          </div>
        </div>
        <div className="dossiers-list">
          {filteredPatients
            .filter((patient) =>
              patient[categoryFilter]?.toLowerCase().includes(filter.toLowerCase())
            )
            .sort((a,b) => a.lastName.localeCompare(b.lastName))
            .map((patient) => (
              <div key={patient.id} className="patient-item"
              onClick={() => navigate(`/patient/${patient.id}`)}
              style={{ cursor: "pointer" }} >
                <p id="lastName">Nom : <strong>{patient.lastName}</strong></p>
                <p id="firstName">Prénom : <strong>{patient.firstName}</strong></p>
                <p id="dob">Date de naissance : <strong>{patient.dateOfBirth}</strong></p>
                <p id="phone">Téléphone : <strong>{patient.phone1}</strong></p>
                <p id="email">Email : <strong>{patient.email}</strong></p>
                <p id="doctor">Médecin : <strong>{patient.doctorName}</strong></p>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dossiers;
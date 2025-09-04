import { useState, useEffect } from "react";
import "./agenda.css";
import { database } from "../../firebaseConfig";
import { ref, get, set, push, onValue } from "firebase/database";
import Navigation from "../navigation/navigation";
import Footer from "../../components/footer";
import "../../components/weatherForecast/fetchWeather.js";
import CalendarComponent from "../../components/calendar/calendar.jsx";
import HeaderDashboard from "../../components/headerDashboard.jsx";

const AppointmentAgenda = () => {
  const [patients, setPatients] = useState([]); // Liste des patients
  const [filteredPatients, setFilteredPatients] = useState([]); // Résultats filtrés
  const [filter, setFilter] = useState(""); // Terme de recherche
  const [appointments, setAppointments] = useState([]); // Liste des rendez-vous
  const [newAppointment, setNewAppointment] = useState({
    patient: null,
    date: "",
    time: "",
    note: "",
  });

  useEffect(() => {
    // Récupérer les données des patients
    const fetchPatients = async () => {
      try {
        const patientsRef = ref(database, "patients");
        const snapshot = await get(patientsRef);

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
        console.error("Erreur lors de la récupération des patients :", error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    // Récupérer les rendez-vous depuis Firebase
    const appointmentsRef = ref(database, "appointments");
    const unsubscribe = onValue(appointmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const appointmentArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setAppointments(appointmentArray);
      } else {
        setAppointments([]);
      }
    });

    return () => unsubscribe(); // Nettoyage de l'écouteur
  }, []);

  useEffect(() => {
    // Filtrer les patients seulement lorsque le filtre est rempli
    if (filter) {
      const lowerCaseFilter = filter.toLowerCase();
      setFilteredPatients(
        patients.filter(
          (patient) =>
            patient.lastName.toLowerCase().includes(lowerCaseFilter) ||
            patient.firstName.toLowerCase().includes(lowerCaseFilter)
        )
      );
    } else {
      setFilteredPatients([]); // Vider la liste si aucun filtre
    }
  }, [filter, patients]);

  const handleAddAppointment = async () => {
    if (!newAppointment.patient || !newAppointment.date || !newAppointment.time) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const appointmentRef = push(ref(database, "appointments"));
    const appointmentData = {
      ...newAppointment,
      patient: {
        id: newAppointment.patient.id,
        lastName: newAppointment.patient.lastName,
        firstName: newAppointment.patient.firstName,
        address: newAppointment.patient.address,
      },
    };

    try {
      await set(appointmentRef, appointmentData);
      setNewAppointment({ patient: null, date: "", time: "", note: "" });
    } catch (error) {
      console.error("Erreur lors de l'ajout du rendez-vous :", error);
      alert("Erreur lors de l'ajout du rendez-vous.");
    }
  };

  const handleCancel = () => {
    setNewAppointment({ patient: null, date: "", time: "", note: "" });
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const appointmentRef = ref(database, `appointments/${appointmentId}`);
      await set(appointmentRef, null);
    } catch (error) {
      console.error("Erreur lors de la suppression du rendez-vous :", error);
      alert("Erreur lors de la suppression du rendez-vous.");
    }
  };

    const sortedList = [...appointments].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });

  

  return (
    <>
      <HeaderDashboard />
      <h2 id="agendaTitle">Agenda</h2>
      <div className="navigation">
        <Navigation />
        </div>  
        <CalendarComponent
        appointments={appointments} // Rendez-vous actuels
        onAddAppointment={(newAppointment) => setAppointments((prev) => [...prev, newAppointment])}
        />
      <div className="patient-search-container">
        <input
          type="text"
          placeholder="Rechercher un patient"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {filter && filteredPatients.length > 0 && (
          <ul className="patient-list">
            {filteredPatients.map((patient) => (
              <li
                key={patient.id}
                className="patient-list-item"
                onClick={() =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    patient,
                  }))
                }
              >
                {patient.lastName} {patient.firstName}
              </li>
            ))}
          </ul>
        )}
      </div>

  
      {newAppointment.patient && (
        <div className="patient-info.container">
          <strong>Patient sélectionné :</strong> {newAppointment.patient.lastName}{" "}
          {newAppointment.patient.firstName}
          <br />
          <strong>Adresse :</strong> {newAppointment.patient.address}
        </div>
      )}

 
      <div className="calendar">
        <input
          type="date"
          value={newAppointment.date}
          onChange={(e) => setNewAppointment((prev) => ({ ...prev, date: e.target.value }))}
        />
        <input
          type="time"
          value={newAppointment.time}
          onChange={(e) => setNewAppointment((prev) => ({ ...prev, time: e.target.value }))}
        />
        <textarea
          placeholder="Ajouter une note"
          value={newAppointment.note}
          onChange={(e) => setNewAppointment((prev) => ({ ...prev, note: e.target.value }))}
        ></textarea>
        <div className="button-group">
          <button onClick={handleAddAppointment} className="button">Ajouter</button>
          <button onClick={handleCancel} className="button cancel-button">Annuler</button>
        </div>
      </div>
      <div className="appointment-list">
  <table>
    <tbody>
      {sortedList.map((appointment) => (
        <tr key={appointment.id}>
          <td className="tableContainer">
            <strong>{appointment.date}</strong>
          </td>
          <td>
            <strong>{appointment.time}</strong>
          </td>
          <td className="tableContainer">
            {appointment.patient?.lastName} {appointment.patient?.firstName}
          </td>
          <td>
            {appointment.patient?.address}
          </td>
          <td>
            Note: {appointment.note || "Aucune note"}
          </td>
          <td>
            <button 
              className="delete-button" 
              onClick={() => cancelAppointment(appointment.id)}
            >
              Supprimer
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      <Footer />
    </>
  );
};

export default AppointmentAgenda;
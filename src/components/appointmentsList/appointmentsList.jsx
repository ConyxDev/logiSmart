import { useState, useEffect } from "react";
import { database } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import "./appointmentsList.css";

const AppointmentList = () => {
  
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState("today");

  useEffect(() => {

    const fetchAppointments = async () => {
      try {
        const appointmentsRef = ref(database, "appointments");
        const snapshot = await get(appointmentsRef);

        if (snapshot.exists()) {
          const appointmentData = snapshot.val();
          const appointmentArray = Object.keys(appointmentData).map((key) => ({
            id: key,
            ...appointmentData[key],
          }));

          const today = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1);

          const filteredList =
          filter === "today"
            ? appointmentArray.filter((appointment) => {
                const appointmentDate = new Date(appointment.date);
                return appointmentDate.toDateString() === today.toDateString();
              })
            : filter === "tomorrow"
            ? appointmentArray.filter((appointment) => {
                const appointmentDate = new Date(appointment.date);
                return appointmentDate.toDateString() === tomorrow.toDateString();
              })
            : appointmentArray;

        // Trier par date et heure croissantes
        const sortedList = filteredList.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA - dateB;
        });

        setFilteredAppointments(sortedList); // Rendez-vous filtrés
      } else {
        console.error("Aucun rendez-vous trouvé.");
      }
      } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous :", error);
      }
  };

  fetchAppointments();
}, [filter]);
          
        
  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setFilter(filterValue);
  };

  
  return (
    <div className="appointment-list-container">
        <div className="dailyappointContainer">
      <h2>Rendez-vous</h2>
      <img src="src/assets/icon/agenda 1.svg" alt="calendar" />
        </div>
      <select
        name="daily-appointments"
        id="daily-appointments"
        value={filter}
        onChange={handleFilterChange}
      >
        <option value="all">Tous les rendez-vous</option>
        <option value="today">Rendez-vous du jour</option>
        <option value="tomorrow">Rendez-vous de demain</option>
      </select>
      <div className="appointment-list">
        {filteredAppointments.length > 0 ? (
          <ul>
            {filteredAppointments.map((appointment) => (
              <li key={appointment.id}>
                <strong>{appointment.date} à {appointment.time}</strong> -{" "}
                {appointment.patient?.lastName} {appointment.patient?.firstName} -{" "}
                {appointment.comment && <p>Commentaire : {appointment.comment}</p>}
                <strong>Adresse:</strong> {appointment.patient?.address}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun rendez-vous trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
import {useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react'; 
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {database} from '../../firebaseConfig';
import {ref, get, push, set, onValue} from 'firebase/database';
import "./calendar.css";

const CalendarComponent = ({appointments =[], onAddAppointment}) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
      const calendarEvents = appointments.map((appointment) => ({
        id: appointment.id,
        title: `${appointment.patient?.firstName} ${appointment.patient?.lastName}`,
        start: `${appointment.date}T${appointment.time}`,
        extendedProps: {
        note: appointment.note, 
        address: appointment.patient?.address
      },
      }));
      setEvents(calendarEvents);
    }, [appointments]);

    /* const handleDateSelect = async (selectInfo) => {
      const title = prompt("Entrez le nom du rendez-vous :");
      const note = prompt("Ajoutez une note :");
      const time = prompt("Entrez l'heure du rendez-vous :");
      const address = prompt("Entrez l'adresse du rendez-vous :");
      if (!title) {
        alert("Le nom du rendez-vous est obligatoire.");
        return;
      } */

   /*    const appointmentData = {
        date: selectInfo.startStr.split("T")[0],
        time: selectInfo.startStr.split("T")[1] || "00:00",
        note: note || "",
        patient: null, // Vous pouvez ajouter une fonctionnalité pour sélectionner un patient ici
      };

      try {
        const appointmentRef = push(ref(database, "appointments"));
        await set(appointmentRef, appointmentData);
        onAddAppointment({ id: appointmentRef.key, ...appointmentData }); */

/* 

    setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: appointmentRef.key,
          title,
          start: selectInfo.startStr,
          extendedProps: { note, address: "Adresse inconnue" },
        },
      ]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du rendez-vous :", error);
    }
    }; */

    /* const handleDateClick = (clickInfo) => {
    alert(`Vous avez cliqué sur la date : ${clickInfo.dateStr}`);
    }; */
  const handleEventClick = (info) => {
    setSelectedEvent({
      title: info.event.title,
      note: info.event.extendedProps.note,
      address: info.event.extendedProps.address,
    });
  };

  const closeModal = () =>{
    setSelectedEvent(null);
  }

    return (
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          events={events}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale="fr"
          eventColor="#378006"
/*           select={handleDateSelect} */
          /* dateClick={handleDateClick} */
          eventClick={handleEventClick}
        />
        {selectedEvent && (
             <div className="archive-modal-overlay" onClick={closeModal}>
             <div
               className="archive-modal-content"
               onClick={(e) => e.stopPropagation()} // Empêche la propagation pour ne pas fermer la modal en cliquant dessus
             >
               <h3>{selectedEvent.title}</h3>
               <p>
                 <strong>Note :</strong> {selectedEvent.note || "Aucune note"}
               </p>
               <p>
                 <strong>Adresse :</strong> {selectedEvent.address || "Non spécifiée"}
               </p>
               <button className="close-button" onClick={closeModal}>
                 Fermer
               </button>
             </div>
           </div>
         )}
       </div>
    );
  };
  
  export default CalendarComponent;
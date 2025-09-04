import { useState, useEffect } from "react";
import "./taches.css";
import { database } from "../../firebaseConfig";
import { ref, get, push, set, remove } from "firebase/database";
import Navigation from "../navigation/navigation";
import HeaderDashboard from "../../components/headerDashboard";
import Footer from "../../components/footer";

const TodoList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filter, setFilter] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    text: "",
    patient: null,
    date: "",
  });

  // Récupération des patients
  useEffect(() => {
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

  // Récupération des tâches depuis Firebase
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksRef = ref(database, "tasks");
        const snapshot = await get(tasksRef);

        if (snapshot.exists()) {
          const taskData = snapshot.val();
          const taskArray = Object.keys(taskData).map((key) => ({
            id: key,
            ...taskData[key],
          }));
          setTasks(taskArray);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches :", error);
      }
    };

    fetchTasks();
  }, []);

  // Filtrage dynamique des patients
  useEffect(() => {
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
      setFilteredPatients([]);
    }
  }, [filter, patients]);

  // Ajouter une tâche
  const handleAddTask = async () => {
    if (!newTask.text || !newTask.patient || !newTask.date) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const taskRef = push(ref(database, "tasks"));
    const taskData = {
      ...newTask,
      patient: {
        id: newTask.patient.id,
        lastName: newTask.patient.lastName,
        firstName: newTask.patient.firstName,
      },
      completed: false,
    };

    try {
      await set(taskRef, taskData);
      setTasks((prev) => [...prev, { id: taskRef.key, ...taskData }]);
      setNewTask({ text: "", patient: null, date: "" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
      alert("Erreur lors de l'ajout de la tâche.");
    }
  };

  // Supprimer une tâche
  const handleDeleteTask = async (taskId) => {
    try {
      const taskRef = ref(database, `tasks/${taskId}`);
      await remove(taskRef);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
      alert("Erreur lors de la suppression de la tâche.");
    }
  };

  const sortedList = [...tasks].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  return (
    <>
      <HeaderDashboard />
      <h2 id="toDoListTitle">To Do List</h2>
      <div className="navigation">
        <Navigation />
        </div>  
        <div className="unique-todo-container">
  <h3 className="unique-todo-title">Liste de tâches</h3>

  {/* Recherche de patient */}
  <div className="unique-patient-search">
    <input
      className="unique-patient-input"
      type="text"
      placeholder="Rechercher un patient"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />
    {filter && filteredPatients.length > 0 && (
      <ul className="unique-patient-list">
        {filteredPatients.map((patient) => (
          <li
            className="unique-patient-item"
            key={patient.id}
            onClick={() =>
              setNewTask((prev) => ({
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

  {/* Affichage des informations du patient sélectionné */}
  {newTask.patient && (
    <div className="unique-patient-info">
      <strong>Patient sélectionné :</strong> {newTask.patient.lastName} {newTask.patient.firstName}
    </div>
  )}

  {/* Formulaire pour ajouter une tâche */}
  <div className="unique-task-form">
    <input
      className="unique-task-input"
      type="text"
      placeholder="Nouvelle tâche"
      value={newTask.text || ""}
      onChange={(e) => setNewTask((prev) => ({ ...prev, text: e.target.value }))}
    />
    <input
      className="unique-task-date-input"
      type="date"
      value={newTask.date || ""}
      onChange={(e) => setNewTask((prev) => ({ ...prev, date: e.target.value }))}
    />
    <button className="unique-add-task-button" onClick={handleAddTask}>
      Ajouter
    </button>
  </div>

  <div className="unique-task-list-container">
    <ul className="unique-task-list">
      {sortedList.map((task, index) => (
        <li
          key={task.id}
          className={`unique-task-item ${task.completed ? "unique-task-completed" : ""}`}
        >
          <div className="unique-task-details">
            <p>
              <strong>Tâche :</strong> {task.text}
            </p>
            <p>
              <strong>Patient :</strong> {task.patient?.lastName} {task.patient?.firstName}
            </p>
            <p>
              <strong>Date :</strong> {task.date}
            </p>
          </div>
          <button
            className="unique-delete-task-button"
            onClick={() => handleDeleteTask(task.id)}
          >
            ✖
          </button>
        </li>
      ))}
    </ul>
  </div>
</div>
      <Footer />
    </>
  );
};

export default TodoList;
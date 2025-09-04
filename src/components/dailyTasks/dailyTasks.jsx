import { useState, useEffect } from "react";
import { database } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import "./dailyTasks.css";

const DailyTasks = () => {
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState("today");

  // Récupérer les tâches depuis Firebase
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


          const today = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1);
      
          const filteredList =
          filter === "today"
          ? taskArray.filter((task) => {
              const taskDate = new Date(task.date);
              return taskDate.toDateString() === today.toDateString();
            })
          : filter === "tomorrow"
          ? taskArray.filter((task) => {
              const taskDate = new Date(task.date);
              return taskDate.toDateString() === tomorrow.toDateString();
            })
          : taskArray;

          const sortedList = filteredList.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
          });

          setFilteredTasks(sortedList);
        } else {
          console.log("Aucune tâche trouvée.");
        }
      } catch (error) {
        console.error ("Erreur lors de la récupération des tâches :", error);
      }
    };

    fetchTasks();
  }, [filter]);


  // Gestion du changement de filtre
  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setFilter(filterValue);
  };

  return (
    <div className="daily-tasks-container">
      <div className="dailyTasksHeader">
        <h2>Tâches</h2>
        <img src="src/assets/icon/checklist 1.svg" alt="tasks" />
      </div>
      <select
        name="task-filter"
        id="task-filter"
        value={filter}
        onChange={handleFilterChange}
      >
        <option value="all">Toutes les tâches</option>
        <option value="today">Tâches du jour</option>
        <option value="tomorrow">Tâches de demain</option>
      </select>
      <div className="task-list">
        {filteredTasks.length > 0 ? (
          <ul>
            {filteredTasks.map((task) => (
              <li key={task.id}>
                {new Date(task.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "} -
                {task.patient?.lastName}  {task.patient?.firstName} - {task.text} 
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune tâche trouvée.</p>
        )}
      </div>
    </div>
  );
};

export default DailyTasks;
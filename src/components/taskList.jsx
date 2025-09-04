import {useState} from 'react'

const ToDoList = () => {
    const [task, setTask] = useState('');
    const [filtre, setFiltre] = useState('');
    const [tri, setTri] = useState(false);
    const [add, setAdd] = useState([]);

    const addTask = () => {
        setAdd([...add, task]);
        setTask('');
    };

    const clearTask = () => {
        setAdd([]);
    };

    const tachesFiltrees = add.filter((tache) => tache.toLowerCase().startsWith(filtre));
    if (tri) {
        tachesFiltrees.sort();
    }

    return (
        <>
            <div className="task-list-container">
  <h1 className="task-list-title">Liste des tâches</h1>

  <div className="task-input-container">
    <input
      className="task-input"
      type="text"
      value={task}
      onChange={(event) => setTask(event.target.value)}
      placeholder="Nouvelle tâche"
    />
    <input
      className="task-filter-input"
      type="text"
      placeholder="Recherche"
      onChange={(event) => setFiltre(event.target.value)}
    />
  </div>

  <div className="task-buttons-container">
    <button className="task-button" onClick={addTask}>
      Ajouter
    </button>
    <button className="task-button reset-button" onClick={clearTask}>
      Reset
    </button>
    <button className="task-button" onClick={() => setTri(true)}>
      Trier
    </button>
    <button className="task-button" onClick={() => setTri(false)}>
      Pas Trier
    </button>
  </div>

  <ul className="task-list">
    {tachesFiltrees.map((list, index) => (
      <li className="task-item" key={index}>
        {list}
      </li>
    ))}
  </ul>
</div>
        </>
    );
};

export default ToDoList;
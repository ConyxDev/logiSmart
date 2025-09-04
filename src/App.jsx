import {Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import './index.css'
import HomePage from "./features/homePage/homePage";
import LoginPage from './features/loginPage/loginPage';
import Dossiers from './features/dossiers/dossiers';
import AddPatient from './components/addPatient/addPatient';
import CheckPatient from "./components/checkPatient/checkPatient";
import AppointmentAgenda from './features/agenda/agenda';
import TodoList from './features/taches/taches';



const App = () => {

  return (
<Routes>
      {/* Route pour la page de connexion */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/homePage" element={<HomePage />} />
      <Route path="/dossiers" element={<Dossiers />} />
      <Route path="/agenda" element={<AppointmentAgenda />} />
      <Route path="/taches" element={<TodoList />} />
      <Route path="/add-patient" element={<AddPatient />} />
      <Route path="/patient/:id" element={<CheckPatient />} />
    </Routes>
  );
};

export default App;

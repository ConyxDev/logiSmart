import { NavLink } from "react-router-dom";
import "./navigation.css";
import {useEffect} from "react";
import {useState} from "react";


const Navigation = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };
      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  return (
    <nav className="navigation">
      <NavLink to="/homePage" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Tableau de bord
      </NavLink>
      <NavLink to="/dossiers" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Dossiers
      </NavLink>
      <NavLink to="/agenda" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Agenda
      </NavLink>
      <NavLink to="/facturation" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Facturation
      </NavLink>
      <NavLink to="/taches" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Tâches
      </NavLink>
      <NavLink to="/documents" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Documents
      </NavLink>
      <NavLink to="/contacts" className={({ isActive }) => (isActive ? "active-link" : "")}>
        Contacts
      </NavLink>
    </nav>
  );
};

export default Navigation;
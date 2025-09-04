import { useState, useEffect } from "react";
import "./stickyTabs.css";

const StickyTabs = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 50); // 50px de défilement pour déclencher sticky
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`tabs-container ${isSticky ? "sticky" : ""}`}>
      <div className="tabs">
      <a href="#general-info">Informations Générales</a>
      <a href="#situation">Situation</a>
      <a href="#treatments">Traitements</a>
      <a href="#care">Soins</a>
      <a href="#vitals">Paramètres Vitaux</a>
      <a href="#transmissions">Transmissions</a>
      <a href="#documents">Documents</a>
    </div>
    </div>
  );
};

export default StickyTabs;
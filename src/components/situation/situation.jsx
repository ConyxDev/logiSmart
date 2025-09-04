import { useState, useEffect } from 'react';
import './situation.css';

const SituationSection = ({ medicalHistory, onMedicalHistoryChange, shouldReset, onReset }) => {
  const [localMedicalHistory, setLocalMedicalHistory] = useState({
    currentIssues: medicalHistory?.currentIssues || '',
    pastHistory: medicalHistory?.pastHistory || '', // Aligné avec le nom dans defaultPatientData
    risks: medicalHistory?.risks || ''
  });


  useEffect(() => {
    if (shouldReset) {
      setLocalMedicalHistory({
        currentIssues: '',
        medicalHistory: '',
        risks: ''
      });
      onReset?.();
    }
  }, [shouldReset, onReset]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedMedicalHistory = { ...localMedicalHistory, [name]: value };
    setLocalMedicalHistory(updatedMedicalHistory);
    onMedicalHistoryChange?.(updatedMedicalHistory);
  };

  return (
    <div className="situation-container">
      <h2>Situation</h2>
      <div>
        <label>Problèmes Actuels:</label>
        <textarea
          name="currentIssues"
          value={localMedicalHistory.currentIssues}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div>
        <label>Antécédents Chirurgicaux/Médicaux:</label>
        <textarea
          name="pastHistory"  // Doit correspondre au nom dans le state
          value={localMedicalHistory.pastHistory}  // Doit correspondre au nom dans le state
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div>
        <label>Risques:</label>
        <textarea
          name="risks"
          value={localMedicalHistory.risks}
          onChange={handleInputChange}
        ></textarea>
      </div>
    </div>
  );
};

export default SituationSection;
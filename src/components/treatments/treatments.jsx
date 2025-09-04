import {useState, useEffect, useCallback} from 'react';
import './treatments.css';

const TreatmentsSection = ({treatments, onTreatmentsChange, shouldReset, onReset }) => {

  const [savedTreatments, setSavedTreatments] =  useState(treatments);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deletingTreatmentIndex, setDeletingTreatmentIndex] = useState(null);
  const [treatment, setTreatment] = useState({
      startDate: '',
      medication: '',
      dosage: '',
      schedule: '',
      prescriber: '',
      notes: '', 
      endDate: ''
    });
   
    useEffect(() => {
      setSavedTreatments(treatments);
    }, [treatments]);

    useEffect(() => {
      if (shouldReset) {
        setSavedTreatments([]);
        setTreatment({
          startDate: '',
          medication: '',
          dosage: '',
          schedule: '',
          prescriber: '',
          notes: '',
          endDate: ''
        });
        onReset?.();
      }
    }, [shouldReset, onReset]);
  
    const saveTreatment = useCallback(() => {
      if (!treatment.medication || !treatment.startDate) {
        alert('Veuillez au moins remplir le médicament et la date de début');
        return;
      }
  
      const newTreatments = [...savedTreatments, treatment];
      setSavedTreatments(newTreatments);
      onTreatmentsChange?.(newTreatments);
  
      setTreatment({
        startDate: '',
        medication: '',
        dosage: '',
        schedule: '',
        prescriber: '',
        notes: '',
        endDate: ''
      });
    }, [treatment, savedTreatments, onTreatmentsChange]);
  
    const confirmDeleteTreatment = useCallback((index) => {
      setIsConfirmingDelete(true);
      setDeletingTreatmentIndex(index);
    }, []);

    
    const deleteTreatment = useCallback(() => {
      const newTreatments = savedTreatments.filter((_, index) => index !== deletingTreatmentIndex);
      setSavedTreatments(newTreatments);
      onTreatmentsChange?.(newTreatments);
      setIsConfirmingDelete(false);
      setDeletingTreatmentIndex(null);
    }, [deletingTreatmentIndex, savedTreatments, onTreatmentsChange]);
  
    const cancelDelete = useCallback(() => {
      setIsConfirmingDelete(false);
      setDeletingTreatmentIndex(null);
    }, []);

    return (
        <div className="treatments-container">
          <div className="treatments-form">
            <h2>Traitements</h2>
            <div>
              <label>Date de début:</label>
              <input 
                type="date"
                value={treatment.startDate}
                onChange={e => setTreatment({...treatment, startDate: e.target.value})}
              />
            </div>
            <div>
              <label>Médicaments:</label>
              <input 
                type="text"
                placeholder="Nom des médicaments"
                value={treatment.medication}
                onChange={e => setTreatment({...treatment, medication: e.target.value})}
              />
            </div>
            <div>
              <label>Posologie:</label>
              <input 
                type="text"
                placeholder="Dosage"
                value={treatment.dosage}
                onChange={e => setTreatment({...treatment, dosage: e.target.value})}
              />
            </div>
            <div>
              <label>M-M-S-C:</label>
              <input 
                type="text"
                placeholder="Matin, Midi, Soir, Coucher"
                value={treatment.schedule}
                onChange={e => setTreatment({...treatment, schedule: e.target.value})}
              />
            </div>
            <div>
              <label>Médecin prescripteur:</label>
              <input 
                type="text"
                placeholder="Nom du médecin"
                value={treatment.prescriber}
                onChange={e => setTreatment({...treatment, prescriber: e.target.value})}
              />
            </div>
            <div>
              <label>Spécificités:</label>
              <textarea 
                placeholder="Notes spécifiques"
                value={treatment.notes}
                onChange={e => setTreatment({...treatment, notes: e.target.value})}
              />
            </div>
            <div>
              <label>Date de fin:</label>
              <input 
                type="date"
                value={treatment.endDate}
                onChange={e => setTreatment({...treatment, endDate: e.target.value})}
              />
            </div>
            <button onClick={saveTreatment}>Ajouter un traitement</button>
          </div>
     
          <div className="treatments-list">
            <h3>Traitements en cours</h3>
            {isConfirmingDelete && (
        <div className="delete-confirmation-modal">
            <div className="delete-confirmation-content">
            <h3>Êtes-vous sûr de vouloir supprimer ce traitement ?</h3>
            <div className='delete-confirmation-modal'>
              <button onClick={deleteTreatment}>Oui, supprimer</button>
              <button onClick={cancelDelete}>Annuler</button>
            </div>
            </div>
        </div>
      )}
            {savedTreatments.map((t, i) => (
              <div key={i} className="treatment-item">
                <p>{t.startDate}</p>
                <p>{t.medication}</p>
                <p>{t.dosage}</p>
                <p>{t.schedule}</p>
                <p>{t.prescriber}</p>
                <p>{t.notes}</p>
                <p>{t.endDate}</p>
                <button onClick={() => confirmDeleteTreatment(i)}>Annuler</button>
              </div>
            ))}
            
          </div>
        </div>
      );
    };
   
   export default TreatmentsSection;
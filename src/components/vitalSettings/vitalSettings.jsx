import {useState, useEffect, useCallback} from 'react';
import './vitalSettings.css';

const VitalsSection = ({vitals = [], onVitalsChange, shouldReset, onReset}) => {
    const [vital, setVital] = useState({
      startDate: '',
      TA: '',
      Puls: '',
      Frequency: '',
    });
   
    const [savedVitals, setSavedVitals] = useState(vitals);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [deletingVitalIndex, setDeletingVitalIndex] = useState(null)
   
    useEffect(() => {
        if (JSON.stringify(vitals) !== JSON.stringify(savedVitals)) {
          setSavedVitals(vitals);
        }
    }, [vitals]);

    useEffect(() => {
        if (shouldReset) {
          setSavedVitals([]);
          setVital({
            startDate: '',
            TA: '',
            Puls: '',
            Frequency: '',
          });
          onReset?.();
        }
        }, [shouldReset, onReset]);

    const saveVital = useCallback(() => {
        if (!vital.TA || !vital.startDate) {
          alert('Veuillez au moins remplir la tension arterielle et la date de début');
          return;
        }

        const newVitals = [...savedVitals, vital];
        setSavedVitals(newVitals);
        onVitalsChange?.(newVitals);

        setVital({
            startDate: '',
            TA: '',
            Puls: '',
            Frequency: '',
            });
        }, [vital, savedVitals, onVitalsChange]);
   
    const confirmDeleteVital = useCallback((index) => {
        setIsConfirmingDelete(true);
        setDeletingVitalIndex(index);
      }, []);
    
      const deleteVital = useCallback(() => {
        const newVitals = savedVitals.filter((_, index) => index !== deletingVitalIndex);
        setSavedVitals(newVitals);
        onVitalsChange?.(newVitals);
        setIsConfirmingDelete(false);
        setDeletingVitalIndex(null);
      }, [deletingVitalIndex, savedVitals, onVitalsChange]);

      const cancelDelete = useCallback(() => {
        setIsConfirmingDelete(false);
        setDeletingVitalIndex(null);
        }, []);

    return (
        <div className="vitals-container">
          <div className="vitals-form">
            <h2>Paramètres Vitaux</h2>
            <div>
              <label>Date:</label>
              <input 
                type="date"
                value={vital.startDate}
                onChange={e => setVital({...vital, startDate: e.target.value})}
              />
            </div>
            <div>
              <label>TA:</label>
              <input 
                type="text"
                placeholder="Tension Arterielle"
                value={vital.TA}
                onChange={e => setVital({...vital, TA: e.target.value})}
              />
            </div>
            <div>
              <label>Puls:</label>
              <input 
                type="text"
                placeholder="Pulsations"
                value={vital.Puls}
                onChange={e => setVital({...vital, Puls: e.target.value})}
              />
            </div>
            <div>
              <label>Fréquence resp/Sat:</label>
              <input 
                type="text"
                placeholder="Fréquence respiratoire/Saturation"
                value={vital.Frequency}
                onChange={e => setVital({...vital, Frequency: e.target.value})}
              />
            </div>
            <button onClick={saveVital}>Ajouter un paramètre</button>
          </div>
     
          <div className="vitals-list">
            <h3>Paramètres Vitaux</h3>
            {isConfirmingDelete && (
        <div className="delete-confirmation-modal">
            <div className="delete-confirmation-content">
            <h3>Êtes-vous sûr de vouloir supprimer ce paramètre ?</h3>
            <div className='delete-confirmation-modal'>
              <button onClick={deleteVital}>Oui, supprimer</button>
              <button onClick={cancelDelete}>Annuler</button>
            </div>
            </div>
        </div>
      )}
            {savedVitals.map((t, i) => (
              <div key={i} className="vital-item">
                <p>{t.startDate}</p>
                <p>{t.TA}</p>
                <p>{t.Puls}</p>
                <p>{t.Frequency}</p>
                <button onClick={() => confirmDeleteVital(i)}>Annuler</button>
              </div>
            ))}
            
          </div>
        </div>
      );
     };
   
   export default VitalsSection;
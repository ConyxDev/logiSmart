import {useState, useEffect, useCallback} from 'react';
import './care.css';

const CaresSection = ({cares = [], onCaresChange, shouldReset, onReset}) => {
    const [care, setCare] = useState({
      planification: '',
      schedule: '',
      protocole: '',
    });
   
    const [savedCares, setSavedCares] = useState(cares);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [deletingCareIndex, setDeletingCareIndex] = useState(null);
   
    // Synchroniser avec les props
    useEffect(() => {
        if (JSON.stringify(cares) !== JSON.stringify(savedCares)) {
          setSavedCares(cares);
        }
    }, [cares]);

    // Gérer la réinitialisation
    useEffect(() => {
        if (shouldReset) {
          setSavedCares([]);
          setCare({
            planification: '',
            schedule: '',
            protocole: '',
          });
          onReset?.();
        }
    }, [shouldReset, onReset]);

    const saveCare = useCallback(() => {
        if (!care.planification || !care.schedule) {
          alert('Veuillez au moins remplir la planification et la fréquence');
          return;
        }

        const newCares = [...savedCares, care];
        setSavedCares(newCares);
        onCaresChange?.(newCares);

        setCare({
          planification: '',
          schedule: '',
          protocole: '',
        });
    }, [care, savedCares, onCaresChange]);
   
    const confirmDeleteCare = useCallback((index) => {
        setIsConfirmingDelete(true);
        setDeletingCareIndex(index);
    }, []);
    
    const deleteCare = useCallback(() => {
        const newCares = savedCares.filter((_, index) => index !== deletingCareIndex);
        setSavedCares(newCares);
        onCaresChange?.(newCares);
        setIsConfirmingDelete(false);
        setDeletingCareIndex(null);
    }, [deletingCareIndex, savedCares, onCaresChange]);

    const cancelDelete = useCallback(() => {
        setIsConfirmingDelete(false);
        setDeletingCareIndex(null);
    }, []);
      
    return (
        <div className="cares-container">
          <div className="cares-form">
          <h2>Soins</h2>
            <div>
            <label>Planification des soins:</label>
            <textarea placeholder="Détaillez la planification" 
            value={care.planification}
            onChange={e => setCare(prev => ({...prev, planification: e.target.value}))}
            >
            </textarea>
            </div>
            <div>
            <label>Fréquence/Jour:</label>
              <input 
                type="number" min="1"
                placeholder="Nombre de fois par jour"
                value={care.schedule}
                onChange={e => setCare(prev => ({...prev, schedule: e.target.value}))}
              />
            </div>
            <div>
            <label>Protocole:</label>
            <textarea placeholder="Détaillez la planification" 
            value={care.protocole}
            onChange={e => setCare(prev => ({...prev, protocole: e.target.value}))}>
            </textarea>
            </div>
            <button onClick={saveCare}>+ Ajouter un soin</button>
            </div>
     
          <div className="cares-list">
            <h3>Soins en cours</h3>
            {isConfirmingDelete && (
        <div className="delete-confirmation-modal">
            <div className="delete-confirmation-content">
            <h3>Êtes-vous sûr de vouloir supprimer ce soin ?</h3>
            <div className='delete-confirmation-modal'>
              <button onClick={deleteCare}>Oui, supprimer</button>
              <button onClick={cancelDelete}>Annuler</button>
            </div>
            </div>
        </div>
      )}
            {savedCares.map((t, i) => (
              <div key={i} className="care-item">
                <p>Planification: {t.planification}</p>
                <p>Fréquence/jour: {t.schedule}</p>
                <p>Protocole: {t.protocole}</p>
                <button onClick={() => confirmDeleteCare(i)}>Annuler</button>
              </div>
            ))}
            
          </div>
        </div>
      );
     };
   
   export default CaresSection;
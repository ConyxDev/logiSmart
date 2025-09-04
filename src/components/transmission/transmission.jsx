import {useState, useEffect, useCallback} from 'react';
import './transmission.css';

const TransmissionsSection = ({transmissions = [], onTransmissionsChange, shouldReset, onReset}) => {
    const [transmission, setTransmission] = useState({
      startDate: '',
      initial: '',
      diagnostics: '',
      notes: '',
    });
   
    const [savedTransmissions, setSavedTransmissions] = useState(transmissions);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [deletingTransmissionIndex, setDeletingTransmissionIndex] = useState(null);
   
    // Synchroniser avec les props
    useEffect(() => {
        if (JSON.stringify(transmissions) !== JSON.stringify(savedTransmissions)) {
          setSavedTransmissions(transmissions);
        }
    }, [transmissions]);

    // Gérer la réinitialisation
    useEffect(() => {
        if (shouldReset) {
          setSavedTransmissions([]);
          setTransmission({
            startDate: '',
            initial: '',
            diagnostics: '',
            notes: '',
          });
          onReset?.();
        }
    }, [shouldReset, onReset]);

    const saveTransmission = useCallback(() => {
        if (!transmission.startDate || !transmission.initial) {
          alert('Veuillez au moins remplir la date et les initiales');
          return;
        }

        const newTransmissions = [...savedTransmissions, transmission];
        setSavedTransmissions(newTransmissions);
        onTransmissionsChange?.(newTransmissions);

        setTransmission({
          startDate: '',
          initial: '',
          diagnostics: '',
          notes: '',
        });
    }, [transmission, savedTransmissions, onTransmissionsChange]);
   
    const confirmDeleteTransmission = useCallback((index) => {
        setIsConfirmingDelete(true);
        setDeletingTransmissionIndex(index);
    }, []);
    
    const deleteTransmission = useCallback(() => {
        const newTransmissions = savedTransmissions.filter((_, index) => index !== deletingTransmissionIndex);
        setSavedTransmissions(newTransmissions);
        onTransmissionsChange?.(newTransmissions);
        setIsConfirmingDelete(false);
        setDeletingTransmissionIndex(null);
    }, [deletingTransmissionIndex, savedTransmissions, onTransmissionsChange]);

    const cancelDelete = useCallback(() => {
        setIsConfirmingDelete(false);
        setDeletingTransmissionIndex(null);
    }, []);

    return (
        <div className="transmissions-container">
          <div className="transmissions-form">
            <h2>Transmissions</h2>
            <div>
              <label>Date / Initiale:</label>
              <div className="date-initial-inputs">
                <input 
                  type="date"
                  value={transmission.startDate}
                  onChange={e => setTransmission(prev => ({...prev, startDate: e.target.value}))}
                />
                <input 
                  type="text" 
                  placeholder="Initiale"
                  value={transmission.initial}
                  onChange={e => setTransmission(prev => ({...prev, initial: e.target.value}))}
                />
              </div>
            </div>
            <div>
              <label>Diagnostics Infirmier:</label>
              <textarea 
                placeholder="Écrivez les diagnostics"
                value={transmission.diagnostics}
                onChange={e => setTransmission(prev => ({...prev, diagnostics: e.target.value}))}
              />
            </div>
            <div>
              <label>Observation:</label>
              <textarea 
                placeholder="Ajoutez vos observations"
                value={transmission.notes}
                onChange={e => setTransmission(prev => ({...prev, notes: e.target.value}))}
              />
            </div>
            <button onClick={saveTransmission}>Ajouter une transmission</button>
          </div>
     
          <div className="transmissions-list">
            <h3>Transmissions</h3>
            {isConfirmingDelete && (
              <div className="delete-confirmation-modal">
                <div className="delete-confirmation-content">
                  <h3>Êtes-vous sûr de vouloir supprimer cette transmission ?</h3>
                  <div className="delete-confirmation-buttons">
                    <button onClick={deleteTransmission}>Oui, supprimer</button>
                    <button onClick={cancelDelete}>Annuler</button>
                  </div>
                </div>
              </div>
            )}
            {savedTransmissions.map((trans, index) => (
              <div key={index} className="transmission-item">
                <p><strong>Date:</strong> {trans.startDate}</p>
                <p><strong>Initiale:</strong> {trans.initial}</p>
                <p><strong>Diagnostics:</strong> {trans.diagnostics}</p>
                <p><strong>Observations:</strong> {trans.notes}</p>
                <button onClick={() => confirmDeleteTransmission(index)}>Supprimer</button>
              </div>
            ))}
          </div>
        </div>
    );
};

export default TransmissionsSection;
import React, { useState } from 'react';
import { ref, remove } from "firebase/database";
import { database } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import './deletePatient.css';

const DeletePatient = ({ patientId }) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const navigate = useNavigate();

    const handleDeleteConfirmation = () => {
        setIsConfirmingDelete(true);
    };

    const handleDeletePatient = async () => {
        try {
            const patientRef = ref(database, `patients/${patientId}`);
            await remove(patientRef);
            alert("Patient supprimé avec succès");
            navigate("/dossiers");
        } catch (error) {
            console.error("Erreur lors de la suppression du patient:", error);
            alert("Erreur lors de la suppression du patient");
        } finally {
            setIsConfirmingDelete(false);
        }
    };

    const cancelDelete = () => {
        setIsConfirmingDelete(false);
    };

    return (
        <>
            <button onClick={handleDeleteConfirmation} className="delete-button">
                Supprimer le patient
            </button>

            {isConfirmingDelete && (
                <div className="delete-confirmation-modal">
                    <div className="delete-confirmation-content">
                        <h3>Êtes-vous sûr de vouloir supprimer ce patient ?</h3>
                        <p>Cette action est irréversible.</p>
                        <div className="delete-confirmation-buttons">
                            <button onClick={handleDeletePatient} className="confirm-delete">
                                Oui, supprimer
                            </button>
                            <button onClick={cancelDelete} className="cancel-delete">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeletePatient;
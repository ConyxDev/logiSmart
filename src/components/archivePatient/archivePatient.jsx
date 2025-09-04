import { useState } from 'react';
import { ref, update } from "firebase/database";
import { database } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import './archivePatient.css';

const ArchivePatient = ({ patientId, patientData }) => {
    const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);
    const navigate = useNavigate();

    const handleArchiveConfirmation = () => {
        setIsConfirmingArchive(true);
    };

    const handleArchivePatient = async () => {
        try {
            const patientRef = ref(database, `patients/${patientId}`);
            await update(patientRef, {
                ...patientData,
                generalInformation: {
                    ...patientData.generalInformation,
                    isArchived: true,
                    isActive: false
                }
            });
            alert("Patient archivé avec succès");
            navigate("/dossiers");
        } catch (error) {
            console.error("Erreur lors de l'archivage du patient:", error);
            alert("Erreur lors de l'archivage du patient");
        } finally {
            setIsConfirmingArchive(false);
        }
    };

    const cancelArchive = () => {
        setIsConfirmingArchive(false);
    };

    return (
        <>
            <div className="archive-button-container">
                <button onClick={handleArchiveConfirmation} className="archive-button">
                    Archiver le patient
                </button>
            </div>

            {isConfirmingArchive && (
                <div className="archive-modal-overlay">
                    <div className="archive-modal-content">
                        <h3>Êtes-vous sûr de vouloir archiver ce patient ?</h3>
                        <p>Le patient ne sera plus visible dans la liste active mais pourra être consulté dans les archives.</p>
                        <div className="archive-modal-buttons">
                            <button onClick={handleArchivePatient} className="confirm-archive">
                                Oui, archiver
                            </button>
                            <button onClick={cancelArchive} className="cancel-archive">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ArchivePatient;
import { useState, useEffect } from "react";
import { get } from "firebase/database";
import { database } from "../../firebaseConfig";
import { ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./patientSearch.css";

const PatientSearch = () => {
    const [search, setSearch] = useState('');
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setIsLoading(true);
                const patientsRef = ref(database, "patients");
                const snapshot = await get(patientsRef);

                if (snapshot.exists()) {
                    const patientData = snapshot.val();
                    const patientArray = Object.keys(patientData).map((key) => ({
                        id: key,
                        ...patientData[key].generalInformation,
                    }));
                    setPatients(patientArray);
                } else {
                    console.error("Aucun patient trouvé.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des patients :", error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        setFilteredPatients(
            patients.filter((patient) =>
                `${patient.firstName} ${patient.lastName}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
        );
    }, [search, patients]);

    return (
        <div className="patientSearch">
            <input
                type="text"
                placeholder="Rechercher un patient"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {isLoading && <p>Chargement en cours...</p>}
            {error && <p>Une erreur est survenue : {error.message}</p>}
            {search && (
                <div className="patientSearchContainer">
                    <ul>
                        {filteredPatients.map((patient) => (
                            <li key={patient.id} onClick={() => navigate(`/patient/${patient.id}`)}>
                                {patient.firstName} {patient.lastName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PatientSearch;

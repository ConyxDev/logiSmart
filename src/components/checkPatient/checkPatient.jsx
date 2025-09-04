import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, get, update, remove } from "firebase/database";
import { database } from "../../firebaseConfig";
import "./checkPatient.css";
import HeaderDashboard from "../../components/headerDashboard";
import Navigation from "../../features/navigation/navigation";
import StickyTabs from "../../components/stickyTabs/stickyTabs"
import SignOut from "../../components/logout/signOut";
import Footer from "../../components/footer";
import TransmissionsSection from "../../components/transmission/transmission";
import TopButton from "../../components/topButton/topButton";
import TreatmentsSection from "../treatments/treatments";
import CaresSection from "../../components/care/care";
import VitalsSection from "../../components/vitalSettings/vitalSettings";
import ArchivePatient from "../../components/archivePatient/archivePatient";
import DeletePatient from "../../components/cancelPatient/deletePatient";
import PhotoUploadSection from "../../components/photoSection/photoSection";




const CheckPatient = () => {
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [shouldReset, setShouldReset] = useState(false);
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState({
        appointments: {},
        generalInformation: {
          lastName: "",
          firstName: "",
          dateOfBirth: "",
          gender: "",
          spokenLanguage: "",
          address: "",
          floor: "",
          doorCode: "",
          accessSpecificity: "",
          familyContactName: "",
          doctorName: "",
          doctorPhone: "",
          doctorEmail: "",
          otherProfessionals: [],
          mealDelivery: false,
          homeSecurity: false,
          otherService: "",
          phone1: "",
          phone2: "",
          email: "",
          isActive: false,
          isArchived: false,
        },
        insurance: {
          illnessInsuranceProvider: "",
          illnessInsuranceNumber: "",
          accidentInsuranceProvider: "",
          accidentClaimNumber: "",
          AVSNumber: "",
        },
        medicalHistory: {
          currentIssues: "",
          pastHistory: "",
          risks: "",
        },
        cares: [],
        treatments: [],
        vitals: [],
        transmissions: [],
        documents: [],
        photos: [],
      });


    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const patientRef = ref(database, `patients/${id}`);
                const snapshot = await get(patientRef);
                
                if (snapshot.exists()) {
                    const data = snapshot.val();

                    setPatientData({
                        ...data,
                        treatments: data.treatments || [],
                        cares: data.cares || [],
                        photos: data.photos || [],
                        generalInformation: {
                            ...patientData.generalInformation,
                            ...data.generalInformation
                        },
                        insurance: {
                            ...patientData.insurance,
                            ...data.insurance
                        },
                    });
                } else {
                    console.error("Patient not found");
                    alert("Patient non trouvé");
                    navigate("/dossiers");
                }
            } catch (error) {
                console.error("Error fetching patient:", error);
                alert("Erreur lors du chargement des données");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPatientData();
    }, []);


                const handleInputChange = (e) => {
                    const { name, value } = e.target;
                    const keys = name.split(".");
                    if (keys.length > 1) {
                      setPatientData((prev) => ({
                        ...prev,
                        [keys[0]]: {
                          ...prev[keys[0]],
                          [keys[1]]: value,
                        },
                      }));
                    } else {
                      setPatientData((prev) => ({
                        ...prev,
                        [name]: value,
                      }));
                    }
                  };

                  const handleSavePatient = async () => {
                    try {
                            const patientRef = ref(database, `patients/${id}`);
                            const currentDataSnapshot = await get(patientRef);
                        
                            if (currentDataSnapshot.exists()) {
                                const updatedData = {
                                    ...currentDataSnapshot.val(),
                                    ...patientData,
                                    treatments: patientData.treatments || [],
                                    cares: patientData.cares || [],
                                    vitals: patientData.vitals || [],
                                    transmissions: patientData.transmissions || [],
                                    photos: patientData.photos || [],
                                  };
                            
                                  await update(patientRef, updatedData);
                                  alert("Patient mis à jour avec succès !");
                                  navigate("/dossiers");
                                } else {
                                  alert("Erreur : le patient n'existe pas.");
                                }
                              } catch (error) {
                                console.error("Error updating patient:", error);
                                alert("Erreur lors de la mise à jour du patient.");
                              }
                            };
                

                const handleCaresChange = (cares) => {
                    console.log("Updated cares:", cares);
                    setPatientData(prev => ({
                      ...prev,
                      cares: cares,
                    }));
                  };
                
                  const handleVitalsChange = (vitals) => {
                    console.log("Nouveaux traitements:", vitals);
                    setPatientData(prev => ({
                      ...prev,
                      vitals: vitals
                    }));
                  };
                
                  const handleTransmissionsChange = (transmissions) => {
                    setPatientData(prev => ({
                      ...prev,
                      transmissions: transmissions
                    }));
                  };

                  const handleTreatmentsChange = (treatments) => {
                    console.log("Nouveaux traitements:", treatments);
                    setPatientData(prev => ({
                      ...prev,
                      treatments: treatments
                    }));
                  };


                const handlePhotosChange = (updatedPhotos) => {
                  setPatientData((prev) => ({
                    ...prev,
                    photos: updatedPhotos, // `updatedPhotos` est déjà nettoyé dans `PhotoUploadSection`.
                  }));
                };

              
            return (
            <>
            <div className="mainContainerPatient">
            <HeaderDashboard />
            <div className="dossiers-navigation">
            <h2>Patient: {patientData.generalInformation.lastName} {patientData.generalInformation.firstName}</h2>
            <SignOut />
            </div>
            <div className="add-patient-container">
            <Navigation />
            <StickyTabs />
            <TopButton />
            <section id="general-info">
            <div className="generalContainer">
              <div className="generalInfoflexItem">
                <h2>Informations Générales</h2>
                <div>
                  <label>Nom:</label>
                  <input
                    type="text"
                    name="generalInformation.lastName"
                    value={patientData.generalInformation.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Prénom:</label>
                  <input
                    type="text"
                    name="generalInformation.firstName"
                    value={patientData.generalInformation.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Date de Naissance:</label>
                  <input
                    type="date"
                    name="generalInformation.dateOfBirth"
                    value={patientData.generalInformation.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Genre:</label>
                  <input
                    type="text"
                    name="generalInformation.gender"
                    value={patientData.generalInformation.gender}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Langue Parlée:</label>
                  <input
                    type="text"
                    name="generalInformation.spokenLanguage"
                    value={patientData.generalInformation.spokenLanguage}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Adresse:</label>
                  <input
                    type="text"
                    name="generalInformation.address"
                    value={patientData.generalInformation.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
      <label>Étage:</label>
      <input
        type="text"
        name="generalInformation.floor"
        value={patientData.generalInformation.floor}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Code Porte:</label>
      <input
        type="text"
        name="generalInformation.doorCode"
        value={patientData.generalInformation.doorCode}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Spécificité d'Accès:</label>
      <input
        type="text"
        name="generalInformation.accessSpecificity"
        value={patientData.generalInformation.accessSpecificity}
        onChange={handleInputChange}
      />
    </div>
  </div>

  <div className="generalInfoflexItem">
    <h3>Réseau</h3>
    <div>
      <label>Contact Familial/Proche:</label>
      <input
        type="text"
        name="generalInformation.familyContactName"
        value={patientData.generalInformation.familyContactName}
        placeholder="Nom et lien (ex: Jean Dupont - Frère)"
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Médecin Mandataire:</label>
      <input
        type="text"
        name="generalInformation.doctorName"
        value={patientData.generalInformation.doctorName}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Téléphone Médecin:</label>
      <input
        type="text"
        name="generalInformation.doctorPhone"
        value={patientData.generalInformation.doctorPhone}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Email Médecin:</label>
      <input
        type="email"
        name="generalInformation.doctorEmail"
        value={patientData.generalInformation.doctorEmail}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Autres Professionnels:</label>
      <textarea
        name="generalInformation.otherProfessionals"
        value={patientData.generalInformation.otherProfessionals}
        placeholder="Kinésithérapeute, infirmier, etc."
        onChange={handleInputChange}
      ></textarea>
    </div>
  </div>

  <div className="generalInfoflexItem">
    <h3>Service Associé</h3>
    <div className="addedServices">
      <label>
        <input
          type="checkbox"
          name="generalInformation.mealDelivery"
          checked={patientData.generalInformation.mealDelivery}
          onChange={(e) =>
            setPatientData({
              ...patientData,
              generalInformation: {
                ...patientData.generalInformation,
                mealDelivery: e.target.checked,
              },
            })
          }
        />
        Repas Livré
      </label>
    </div>
    <div className="addedServices">
      <label>
        <input
          type="checkbox"
          name="generalInformation.homeSecurity"
          checked={patientData.generalInformation.homeSecurity}
          onChange={(e) =>
            setPatientData({
              ...patientData,
              generalInformation: {
                ...patientData.generalInformation,
                homeSecurity: e.target.checked,
              },
            })
          }
        />
        Sécurité à Domicile
      </label>
    </div>
    <div>
      <label>Autre (préciser):</label>
      <input
        type="text"
        name="generalInformation.otherService"
        value={patientData.generalInformation.otherService}
        onChange={handleInputChange}
      />
    </div>
  </div>

  <div className="generalInfoflexItem">
    <h3>Contacts</h3>
    <div>
      <label>Téléphone 1:</label>
      <input
        type="text"
        name="generalInformation.phone1"
        value={patientData.generalInformation.phone1}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Téléphone 2:</label>
      <input
        type="text"
        name="generalInformation.phone2"
        value={patientData.generalInformation.phone2}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Email:</label>
      <input
        type="email"
        name="generalInformation.email"
        value={patientData.generalInformation.email}
        onChange={handleInputChange}
      />
    </div>
  </div>

  <div className="generalInfoflexItem">
    <h3>Assurances</h3>
    <div>
      <label>Assurance Maladie (Fournisseur):</label>
      <input
        type="text"
        name="insurance.illnessInsuranceProvider"
        value={patientData.insurance.illnessInsuranceProvider}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Numéro d'Assurance Maladie:</label>
      <input
        type="text"
        name="insurance.illnessInsuranceNumber"
        value={patientData.insurance.illnessInsuranceNumber}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Assurance Accident (Fournisseur):</label>
      <input
        type="text"
        name="insurance.accidentInsuranceProvider"
        value={patientData.insurance.accidentInsuranceProvider}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Numéro de Réclamation Accident:</label>
      <input
        type="text"
        name="insurance.accidentClaimNumber"
        value={patientData.insurance.accidentClaimNumber}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Numéro AVS</label>
      <input
        type="text"
        name="insurance.AVSNumber"
        value={patientData.insurance.AVSNumber}
        onChange={handleInputChange}
      />
    </div>
    </div>
    </div>
    <div className="patient-info-section sticky-section">
      <h2>Détails Patient</h2>
      <div className="formUpdate">
        <button onClick={handleSavePatient}>Mettre à jour</button>
      </div>
      <ul>
  <li><strong>Nom:</strong> {patientData.generalInformation.lastName || "Non renseigné"}</li>
  <li><strong>Prénom:</strong> {patientData.generalInformation.firstName || "Non renseigné"}</li>
  <li><strong>Date de Naissance:</strong> {patientData.generalInformation.dateOfBirth || "Non renseigné"}</li>
  <li><strong>Genre:</strong> {patientData.generalInformation.gender || "Non renseigné"}</li>
  <li><strong>Adresse:</strong> {patientData.generalInformation.address || "Non renseigné"}</li>
  <li><strong>Étage:</strong> {patientData.generalInformation.floor || "Non renseigné"}</li>
  <li><strong>Code Porte:</strong> {patientData.generalInformation.doorCode || "Non renseigné"}</li>
  <li><strong>Spécificité d'Accès:</strong> {patientData.generalInformation.accessSpecificity || "Non renseigné"}</li>
  <li><strong>Langue Parlée:</strong> {patientData.generalInformation.spokenLanguage || "Non renseigné"}</li>
  <li><strong>Téléphone 1:</strong> {patientData.generalInformation.phone1 || "Non renseigné"}</li>
  <li><strong>Téléphone 2:</strong> {patientData.generalInformation.phone2 || "Non renseigné"}</li>
  <li><strong>Email:</strong> {patientData.generalInformation.email || "Non renseigné"}</li>
  <li><strong>Contact Familial/Proche:</strong> {patientData.generalInformation.familyContactName || "Non renseigné"}</li>
  <li><strong>Médecin Mandataire:</strong> {patientData.generalInformation.doctorName || "Non renseigné"}</li>
  <li><strong>Téléphone Médecin:</strong> {patientData.generalInformation.doctorPhone || "Non renseigné"}</li>
  <li><strong>Email Médecin:</strong> {patientData.generalInformation.doctorEmail || "Non renseigné"}</li>
  <li><strong>Autres Professionnels:</strong> {patientData.generalInformation.otherProfessionals || "Non renseigné"}</li>
  <li><strong>Repas Livré:</strong> {patientData.generalInformation.mealDelivery ? "Oui" : "Non"}</li>
  <li><strong>Sécurité à Domicile:</strong> {patientData.generalInformation.homeSecurity ? "Oui" : "Non"}</li>
  <li><strong>Service Associé - Autre:</strong> {patientData.generalInformation.otherService || "Non renseigné"}</li>
  <li><strong>Assurance Maladie:</strong> {patientData.insurance.illnessInsuranceProvider || "Non renseigné"}</li>
  <li><strong>Assurance Mal - Numéro:</strong> {patientData.insurance.illnessInsuranceNumber || "Non renseigné"}</li>
  <li><strong>Assurance Accident:</strong> {patientData.insurance.accidentInsuranceProvider || "Non renseigné"}</li>
  <li><strong>Assurance Acc - Numéro de Réclamation:</strong> {patientData.insurance.accidentClaimNumber || "Non renseigné"}</li>
  <li><strong>Numéro AVS:</strong> {patientData.insurance.AVSNumber || "Non renseigné"}</li>
</ul>
    </div>
          </section>
          <section id="situation">
          <h2>Situation</h2>
          <div>
            <label>Problèmes Actuels:</label>
            <textarea
              name="medicalHistory.currentIssues"
              value={patientData.medicalHistory?.currentIssues}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label>Antécédents Chirurgicaux/Médicaux:</label>
            <textarea
              name="medicalHistory.pastHistory"
              value={patientData.medicalHistory?.pastHistory}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label>Risques:</label>
            <textarea
              name="medicalHistory.risks"
              value={patientData.medicalHistory?.risks}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </section>
          
          <section id="treatments">
        <TreatmentsSection 
        treatments={Array.isArray(patientData.treatments) ? patientData.treatments : []}
        onTreatmentsChange={handleTreatmentsChange}
        shouldReset={shouldReset}
        onReset={() => setShouldReset(false)}
        />
        </section>


          <section id="care">
        <CaresSection cares={Array.isArray(patientData.cares) ? patientData.cares : []}
        onCaresChange={handleCaresChange}
        shouldReset={shouldReset}
        onReset={() => setShouldReset(false)}
        />
        </section>

      <section id="photos">
      <PhotoUploadSection
      photos={patientData.photos || []}
      onPhotosChange={handlePhotosChange}
      />
      </section>

          <section id="vitals">
            <VitalsSection vitals={Array.isArray(patientData.vitals) ? patientData.vitals : []}
        onVitalsChange={handleVitalsChange}
        shouldReset={shouldReset}
        onReset={() => setShouldReset(false)}
        />
          </section>

          <section id="transmissions">
          <TransmissionsSection transmissions={Array.isArray(patientData.transmissions) ? patientData.transmissions : []}
        onTransmissionsChange={handleTransmissionsChange}
        shouldReset={shouldReset}
        onReset={() => setShouldReset(false)}
        />
        </section>
          <div className="formUpdateContainer">
            <div className="formUpdate">
            <ArchivePatient patientId={id} patientData={patientData} />
            </div>
            <div className="formUpdate">
            <DeletePatient patientId={id} />
            </div>
            </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckPatient;






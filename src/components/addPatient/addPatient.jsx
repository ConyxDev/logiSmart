import { useState, useEffect } from "react";
import {ref, push} from "firebase/database";
import {database} from "../../firebaseConfig";
import Navigation from "../../features/navigation/navigation";
import {useNavigate} from "react-router-dom";
import "./addPatient.css";
import HeaderDashboard from "../headerDashboard";
import StickyTabs from "../../components/stickyTabs/stickyTabs";
import TopButton from "../topButton/topButton";
import Footer from "../footer";
import SignOut from "../logout/signOut";
import { getAuth } from "firebase/auth";
import CSVUploadProcessor from "../addPatientOCR/PDFUploadProcessor";
import TreatmentsSection from "../treatments/treatments";
import CaresSection from "../care/care";
import VitalsSection from "../vitalSettings/vitalSettings";
import TransmissionsSection from "../transmission/transmission";
import SituationSection from "../situation/situation";


const defaultPatientData = {
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
  medicalHistory:{
    currentIssues: "",
    pastHistory: "", 
    risks: ""
  },
  cares: [],
  treatments: [],
  vitals: [],
  transmissions: [],
  documents: [],
};


const AddPatient = () => {
  const [patientData, setPatientData] = useState({ ...defaultPatientData });
  const [shouldReset, setShouldReset] = useState(false);
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split(".");
    const fieldValue = type === "checkbox" ? checked : value;
   
      setPatientData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: fieldValue,
        },
      }));
  };

  

  const savePatientData = async () => {
    try {
      
      if (!patientData.generalInformation.lastName || !patientData.generalInformation.firstName || !patientData.generalInformation.dateOfBirth) {
        alert("Merci de compléter les champs demandés (nom de famille, prénom, date de naissance).");
        return;
      }
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        alert("Vous n'êtes pas connecté. Veuillez vous connecter pour ajouter un patient.");
        return;
      }

      const patientsRef = ref(database, "patients");
      const newPatientRef = await push(patientsRef, { ...patientData, usersID: [currentUser.uid] });

      if (newPatientRef.key) {
      alert("Patient added successfully!");
      setPatientData({ ...defaultPatientData });
      setShouldReset(true); 
      navigate("/dossiers");
      } else {
      throw new Error("Data was not saved correctly.");
      }
      } catch (error) {
      console.error("Error saving patient data:", error);
      alert("An error occurred while saving the patient data.");
       }
      };


  const handleDataExtracted = (extractedData) => {
    setPatientData(prev => ({
      ...prev,
      generalInformation: {
        ...prev.generalInformation,
        ...extractedData.generalInformation
      },
      insurance: {
        ...prev.insurance,
        ...extractedData.insurance
      }
    }));
  };


  useEffect(() => {
    if (shouldReset) {
      setPatientData({ ...defaultPatientData });
      setShouldReset(false);
    }
  }, [shouldReset]);

  return (
    <>
    <div className="mainContainerPatient">
      <HeaderDashboard />
      <div className="dossiers-navigation">
      <h2>Nouveau patient</h2>
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
        name="generalInformation.gender"
        value={patientData.generalInformation.gender}
        onChange={handleInputChange}>
      </input>
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
      <label>Spécificité d'accès:</label>
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
        name="AVSNumber"
        value={patientData.insurance.AVSNumber}
        onChange={handleInputChange}
      />
    </div>
    </div>
    </div>
      <div className="patient-info-section sticky-section">
      
      <div className="iaForm">
      <button onClick={savePatientData}>Enregistrer</button>
      <div className="pdf-upload-section">
      <CSVUploadProcessor onDataExtracted={handleDataExtracted} />
      </div>
      </div>
      <h2>Détails Patient</h2>
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
        <SituationSection
    medicalHistory={patientData.medicalHistory}
    onMedicalHistoryChange={(updatedMedicalHistory) =>
      setPatientData((prev) => ({ ...prev, medicalHistory: updatedMedicalHistory }))
    }
    shouldReset={shouldReset}
    onReset={() => setShouldReset(false)}
  />
        </section>

  <section id="treatments">
<TreatmentsSection
    treatments={patientData.treatments}
    onTreatmentsChange={(updatedTreatments) =>
      setPatientData((prev) => ({ ...prev, treatments: updatedTreatments }))
    } 
    shouldReset={shouldReset} 
    onReset={() => setShouldReset(false)}
  />
</section>

<section id="care">
<CaresSection
    cares={patientData.cares}
    onCaresChange={(updatedCares) =>
      setPatientData((prev) => ({ ...prev, cares: updatedCares }))
    } 
    shouldReset={shouldReset} 
    onReset={() => setShouldReset(false)} 
  />
</section>

<section id="vitals">
<VitalsSection
    vitals={patientData.vitals}
    onVitalsChange={(updatedVitals) =>
      setPatientData((prev) => ({ ...prev, vitals: updatedVitals }))
    }
    shouldReset={shouldReset}
    onReset={() => setShouldReset(false)}
  />
</section>
<section id="transmissions">
  <TransmissionsSection 
    transmissions={patientData.transmissions}
    onTransmissionsChange={(updatedTransmissions) =>
      setPatientData((prev) => ({ ...prev, transmissions: updatedTransmissions }))
    }
    shouldReset={shouldReset}
    onReset={() => setShouldReset(false)}
  />	
</section>

        <section id="documents">
          <h2>Documents</h2>
          {/*<DocumentUpload patientData={patientData} setPatientData={setPatientData} />*/}
        </section>
      </div>
      
    </div>
    <Footer />
    </>
  );
};

export default AddPatient;
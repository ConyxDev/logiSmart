import { useState, useRef } from "react";
import Papa from "papaparse";
import "./PDFUploadProcessor.css";

const CSVUploadProcessor = ({ onDataExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const formatDateToISO = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    if (!day || !month || !year) return ""; // Si le format est incorrect
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setIsProcessing(true);
      setError("");

      Papa.parse(file, {
        header: true, // Utilise la première ligne comme noms des colonnes
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError("Erreur lors de l'analyse du fichier CSV.");
            setIsProcessing(false);
            return;
          }

          console.log("Données extraites du CSV :", results.data);
          const extractedData = parseCSVData(results.data);
          onDataExtracted(extractedData);
          setIsProcessing(false);
        },
        error: (err) => {
          console.error("Erreur de traitement CSV :", err);
          setError("Erreur lors du traitement du fichier CSV.");
          setIsProcessing(false);
        },
      });
    } else {
      setError("Veuillez sélectionner un fichier CSV valide.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const parseCSVData = (data) => {
    if (data.length === 0) return {};

    // Exemple : extraction de la première ligne du CSV comme données
    const row = data[0];

    const extractedData = {
      generalInformation: {
        lastName: row["Nom"] || "",
        firstName: row["Prénom"] || "",
        dateOfBirth: formatDateToISO(row["Date de naissance"] || ""),
        gender: row["Genre"] || "",
        spokenLanguage: row["Langue parlée"] || "",
        address: row["Adresse"] || "",
        floor: row["Étage"] || "",
        doorCode: row["Code porte"] || "",
        accessSpecificity: row["Spécificité d'accès"] || "",
        phone1: row["Téléphone 1"] || "",
        phone2: row["Téléphone 2"] || "",
        email: row["Email"] || "",
        familyContactName: row["Contact familial / Proche"] || "",
        doctorName: row["Médecin mandataire"] || "",
        doctorPhone: row["Téléphone médecin"] || "",
        doctorEmail: row["Email médecin"] || "",
        otherProfessionals: row["Autres professionnels (physiothérapeute...)"] || "",
        mealDelivery: row["Repas livré"] === "Oui",
        homeSecurity: row["Sécurité à domicile"] === "Oui",
      },
      insurance: {
        illnessInsuranceProvider: row["Assurance Maladie"] || "",
        illnessInsuranceNumber: row["N° Assurance Maladie"] || "",
        accidentInsuranceProvider: row["Assurance Accident"] || "",
        accidentClaimNumber: row["N° Assurance Accident"] || "",
        AVSNumber: row["Numéro AVS"] || "",
      },
    };

    return extractedData;
  };

  return (
    <div className="csv-upload-section">
      <div className="upload-container">
      <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isProcessing}
          className="file-input"
          ref={fileInputRef}
        />
        <button
          className="custom-upload-button"
          onClick={triggerFileInput}
          disabled={isProcessing}
        >
          {isProcessing ? "Traitement en cours..." : "IA Form"}
        </button>
        {isProcessing && <p className="processing-message">Traitement en cours...</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default CSVUploadProcessor;
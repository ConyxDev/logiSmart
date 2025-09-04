import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";


const DocumentUpload = ({patientData, setPatientData}) => {
    const [newDocumentName, setNewDocumentName] = useState("");
    const [uploading, setUploading] = useState(false);
    const storage = getStorage();
    
    const uploadDocument = async (file) => {
        try {
            setUploading(true);
            const docRef = storageRef(storage, `documents/${file.name}`);
            const snapshot = await uploadBytes(docRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const upadatedDocuments = [
            ...patientData.documents,
            { name: file.name, url: downloadURL, date: new Date().toISOString() },
            ];
            setPatientData({...patientData, documents: upadatedDocuments});

        console.log("Document ajouté avec succès !", downloadURL);
        } catch (error) {
            console.error("Erreur lors de l'ajout du document :", error);
        } finally {
            setUploading(false);
    }
    };

// Fonction pour ajouter un document textuel (sans téléversement de fichier)

const addDocument = (newDocument) => {
    const updatedDocuments = [...patientData.documents, newDocument];
    setPatientData({...patientData, documents: updatedDocuments});
};

const removeDocument = (index) => {
    const updatedDocuments = patientData.documents.filter((_, i) => i !== index);
    setPatientData({...patientData, documents: updatedDocuments});
};

    return (
        <div>
          <div>
            <h3>Télécharger un document</h3>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) uploadDocument(file);
              }}
            /><button>Télécharger un document</button>
            {uploading && <p>Chargement en cours...</p>}
          </div>
    
          <div>
            <h3>Ajouter un document (nom uniquement)</h3>
            <label>Nom du document :</label>
            <input
              type="text"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
            />
            <button
              onClick={() => {
                if (newDocumentName.trim()) {
                  addDocument({ name: newDocumentName, date: new Date().toISOString(), url: "" });
                  setNewDocumentName(""); // Réinitialiser le champ
                }
              }}
            >
              Ajouter un document
            </button>
          </div>
    
          <div>
            <h3>Documents enregistrés</h3>
            <ul>
              {patientData.documents.map((doc, index) => (
                <li key={index}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.name || "Document sans nom"}
                  </a>
                  <button onClick={() => removeDocument(index)}>Supprimer</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    };
    
    export default DocumentUpload;
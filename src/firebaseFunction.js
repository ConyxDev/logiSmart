import { getDatabase, ref, get, set, update, remove } from "firebase/database";
import { database } from "./firebaseConfig"; 

export const getUserData = async (userId) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("Utilisateur non trouvé.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données utilisateur :", error);
    throw error;
  }
};

export const addOrUpdatePatient = async (patientId, data) => {
  try {
    const patientRef = ref(database, `patients/${patientId}`);
    await set(patientRef, data);
    console.log("Patient ajouté/mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout/mise à jour du patient :", error);
    throw error;
  }
};

export const deletePatient = async (patientId) => {
  try {
    const patientRef = ref(database, `patients/${patientId}`);
    await remove(patientRef);
    console.log("Patient supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du patient :", error);
    throw error;
  }
};


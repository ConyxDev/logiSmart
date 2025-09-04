import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database, auth } from "../firebaseConfig"; // Assurez-vous d'importer `auth`

const DisplayUser = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Vérification du userId :", userId);
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          console.log("Données utilisateur récupérées :", snapshot.val());
          setUserData(snapshot.val());
        } else {
          setError("Utilisateur non trouvé.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données utilisateur :", err);
        setError("Erreur lors de la récupération des données.");
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setError("Aucun utilisateur authentifié.");
    }
  }, [userId]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!userData) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div>
      <h1>Bienvenue, {userData.name}</h1>
      <p>Email : {userData.email}</p>
    </div>
  );
};

export default DisplayUser;
import { set, ref } from "firebase/database";
import { auth } from "./firebaseConfig";

const saveUserData = async () => {
  const userId = auth.currentUser?.uid;
  const db = getDatabase();
  await set(ref(db, `users/${userId}`), {
    email: auth.currentUser.email,
    name: "Nom par défaut",
    permissions: {
      canEditAppointments: false,
      canEditPatients: false,
      canViewAppointments: true,
      canViewPatients: true,
    },
    role: "user",
  });
};

export default saveUserData;
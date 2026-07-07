import { initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

// Configuración de Firebase (la obtienes de la consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyAy4pwC6bgZCJ0QkqbjPR-OMRMQdHHulV0",
  authDomain: "com.yeampier.barber",
  projectId: "barber-629c0",
  storageBucket: "barber-629c0.firebasestorage.app",
  messagingSenderId: "118262159405",
  appId: "1:118262159405:android:f891031447c0c4512100a4",
};

// Inicializar Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
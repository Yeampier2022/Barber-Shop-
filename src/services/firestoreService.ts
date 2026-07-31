import { doc, addDoc, getDoc, setDoc, collection, getFirestore, serverTimestamp, Timestamp, } from "@react-native-firebase/firestore";
import type { RegisterInput, UserProfile } from "../types/user";
import { CreateAppointmentInput } from "../types/appointment";

export async function createUserProfile(
  uid: string,
  input: Omit<RegisterInput, "password">
) {
  const db = getFirestore();
  await setDoc(doc(db, "users", uid), {
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    role: input.role,
    createdAt: serverTimestamp(),
  });
  console.log("[Firestore] Profile created at users/" + uid);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirestore();
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) {
    console.log("[Firestore] No profile found at users/" + uid);
    return null;
  }
  console.log("[Firestore] Profile fetched from users/" + uid);
  return snapshot.data() as UserProfile;
}

export async function createAppointment(input: CreateAppointmentInput) {
  const db = getFirestore();
  const appointmentRef = await addDoc(collection(db, "appointments"),
    {
      clientId: input.clientId,
      barberId: input.barberId,
      serviceId: input.serviceId,
      startTime: Timestamp.fromDate(input.startTime),
      endTime: Timestamp.fromDate(input.endTime),
      durationMinutes: input.durationMinutes,
      price: input.price,
      createdAt: serverTimestamp(),
    });
  console.log("[Firestore] Appointment created at appointments/" + appointmentRef.id);
  return appointmentRef.id;
}
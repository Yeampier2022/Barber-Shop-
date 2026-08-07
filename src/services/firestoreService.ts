import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "@react-native-firebase/firestore";
import type { RegisterInput, UserProfile } from "../types/user";

export type AppointmentStatus = "pending" | "approved" | "declined";

// Raw shape of a document in the "appointments" collection.
export type ReservationDoc = {
  id: string;
  barberId?: string;
  clientId?: string;
  serviceId?: string;
  durationMinutes?: number;
  price?: number;
  status?: AppointmentStatus;
  startTime?: unknown;
  endTime?: unknown;
  createdAt?: unknown;
  [key: string]: unknown;
};

export type BarberProfile = UserProfile & { uid: string };

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

export async function createBarberProfile(
  uid: string,
  input: { name: string; phone: string }
) {
  const db = getFirestore();
  await setDoc(doc(db, "barberProfile", uid), {
    name: input.name.trim(),
    phone: input.phone.trim(),
    bio: "",
    photoURL: "",
  });
  console.log("[Firestore] Barber profile created at barberProfile/" + uid);
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

export async function getReservations(
  field: "barberId" | "clientId",
  uid: string
): Promise<ReservationDoc[]> {
  const db = getFirestore();
  const reservationsQuery = query(collection(db, "appointments"), where(field, "==", uid));
  const snapshot = await getDocs(reservationsQuery);

  const reservations: ReservationDoc[] = snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  }));

  console.log(`[Firestore] reservations where ${field} == ${uid}:`, reservations);

  return reservations;
}

export async function getBarbers(): Promise<BarberProfile[]> {
  const db = getFirestore();
  const barbersQuery = query(collection(db, "users"), where("role", "==", "barber"));
  const snapshot = await getDocs(barbersQuery);

  const barbers: BarberProfile[] = snapshot.docs.map((docSnapshot) => ({
    uid: docSnapshot.id,
    ...(docSnapshot.data() as UserProfile),
  }));

  console.log("[Firestore] barbers found:", barbers.length);

  return barbers;
}

export async function createAppointment(input: {
  barberId: string;
  clientId: string;
  serviceId: string;
  price: number;
  durationMinutes: number;
  startTime: Date;
  endTime: Date;
}) {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "appointments"), {
    ...input,
    status: "pending" satisfies AppointmentStatus,
    createdAt: serverTimestamp(),
  });

  console.log("[Firestore] Appointment created:", docRef.id, { status: "pending" });

  return docRef.id;
}

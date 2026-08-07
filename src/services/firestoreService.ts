import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "@react-native-firebase/firestore";
import type { RegisterInput, UserProfile } from "../types/user";
import type { Appointment } from "../types/schedule";
import type {
  AppointmentStatus,
  ConfirmationStatus,
  CreateAppointmentInput,
} from "../types/appointment";

const INITIAL_APPOINTMENT_STATUS: AppointmentStatus = "scheduled";
const INITIAL_CONFIRMATION_STATUS: ConfirmationStatus = "pending";

type FirestoreAppointment = {
  barberId?: string;
  clientId?: string;
  startTime?: Timestamp;
  endTime?: Timestamp;
  status?: AppointmentStatus;
  confirmationStatus?: ConfirmationStatus;
};

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
      status: INITIAL_APPOINTMENT_STATUS,
      confirmationStatus: INITIAL_CONFIRMATION_STATUS,
      createdAt: serverTimestamp(),
    }
  );
  console.log("[Firestore] Appointment created at appointments/" + appointmentRef.id);
  return appointmentRef.id;
}

export function subscribeToBarberAppointments(
  barberId: string,
  day: Date,
  onAppointments: (appointments: Appointment[]) => void,
  onError: (error: Error) => void
) {
  const db = getFirestore();
  const startOfDay = new Date(day);
  startOfDay.setHours(0, 0, 0, 0);

  const startOfNextDay = new Date(startOfDay);
  startOfNextDay.setDate(startOfNextDay.getDate() + 1);

  const appointmentsQuery = query(
    collection(db, "appointments"),
    where("barberId", "==", barberId)
  );

  return onSnapshot(
    appointmentsQuery,
    (snapshot) => {
      const appointments = snapshot.docs.flatMap((appointmentDocument) => {
        const data = appointmentDocument.data() as FirestoreAppointment;

        if (
          !data.barberId ||
          !data.clientId ||
          !data.startTime ||
          !data.endTime ||
          data.startTime.toDate() < startOfDay ||
          data.startTime.toDate() >= startOfNextDay ||
          data.status === "cancelled" ||
          data.confirmationStatus === "declined"
        ) {
          return [];
        }

        return [{
          barberId: data.barberId,
          clientId: data.clientId,
          start: data.startTime.toDate(),
          end: data.endTime.toDate(),
        }];
      });

      onAppointments(appointments);
    },
    (error) => {
      console.error("[Firestore] Could not load barber appointments:", error);
      onError(error);
    }
  );
}

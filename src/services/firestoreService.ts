import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "@react-native-firebase/firestore";
import type { Appointment } from "../types/schedule";
import type {
  AppointmentStatus,
  ConfirmationStatus,
  CreateAppointmentInput,
} from "../types/appointment";
import type { RegisterInput, UserProfile } from "../types/user";
import type { Service } from "../types/service";

export type { AppointmentStatus } from "../types/appointment";

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

type StoredAppointmentStatus =
  | AppointmentStatus
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

type FirestoreAppointment = {
  barberId?: string;
  clientId?: string;
  startTime?: Timestamp;
  endTime?: Timestamp;
  status?: StoredAppointmentStatus;
  confirmationStatus?: ConfirmationStatus;
};

function normalizeAppointmentStatus(
  status: unknown,
  confirmationStatus: unknown
): AppointmentStatus {
  if (status === "approved" || status === "declined" || status === "pending") {
    return status;
  }
  if (status === "cancelled" || confirmationStatus === "declined") {
    return "declined";
  }
  if (confirmationStatus === "confirmed" || status === "completed") {
    return "approved";
  }
  return "pending";
}

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
  const reservationsQuery = query(
    collection(db, "appointments"),
    where(field, "==", uid)
  );
  const snapshot = await getDocs(reservationsQuery);

  const reservations = snapshot.docs.map((documentSnapshot) => {
    const data = documentSnapshot.data();
    return {
      id: documentSnapshot.id,
      ...data,
      status: normalizeAppointmentStatus(
        data.status,
        data.confirmationStatus
      ),
    } as ReservationDoc;
  });

  console.log(`[Firestore] reservations where ${field} == ${uid}:`, reservations);
  return reservations;
}

export async function getBarbers(): Promise<BarberProfile[]> {
  const db = getFirestore();
  const barbersQuery = query(
    collection(db, "users"),
    where("role", "==", "barber")
  );
  const snapshot = await getDocs(barbersQuery);

  const barbers = snapshot.docs.map((documentSnapshot) => ({
    uid: documentSnapshot.id,
    ...(documentSnapshot.data() as UserProfile),
  }));

  console.log("[Firestore] barbers found:", barbers.length);
  return barbers;
}

export async function getServices(): Promise<Service[]> {
  const db = getFirestore();
  const snapshot = await getDocs(collection(db, "services"));

  const services = snapshot.docs.flatMap((documentSnapshot) => {
    const data = documentSnapshot.data();

    if (
      typeof data.name !== "string" ||
      typeof data.description !== "string" ||
      typeof data.duration !== "number" ||
      typeof data.price !== "number"
    ) {
      console.warn(
        `[Firestore] Ignoring invalid service document: services/${documentSnapshot.id}`
      );
      return [];
    }

    return [{
      id: documentSnapshot.id,
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
    }];
  });

  console.log("[Firestore] services found:", services.length);
  return services;
}

export async function createAppointment(input: CreateAppointmentInput) {
  const db = getFirestore();
  const appointmentRef = await addDoc(collection(db, "appointments"), {
    clientId: input.clientId,
    barberId: input.barberId,
    serviceId: input.serviceId,
    startTime: Timestamp.fromDate(input.startTime),
    endTime: Timestamp.fromDate(input.endTime),
    durationMinutes: input.durationMinutes,
    price: input.price,
    status: "pending" satisfies AppointmentStatus,
    createdAt: serverTimestamp(),
  });

  console.log("[Firestore] Appointment created:", appointmentRef.id, {
    status: "pending",
  });
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
          normalizeAppointmentStatus(data.status, data.confirmationStatus) ===
            "declined"
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

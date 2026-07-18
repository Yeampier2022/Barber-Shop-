import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type UserRole = "client" | "barber";

export interface UserProfile {
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  pushToken?: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

export interface RegisterInput {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
}

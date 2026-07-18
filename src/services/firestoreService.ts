import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "@react-native-firebase/firestore";
import type { RegisterInput, UserProfile } from "../types/user";

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

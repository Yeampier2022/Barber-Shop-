import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "@react-native-firebase/auth";

export async function registerWithEmail(email: string, password: string, name: string) {
  const auth = getAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  console.log("[Auth] Account created:", user.uid, user.email);

  await updateProfile(user, { displayName: name.trim() });
  console.log("[Auth] Signed in as:", auth.currentUser?.uid, auth.currentUser?.email);

  return user;
}

export async function signInWithEmail(email: string, password: string) {
  const auth = getAuth();
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
  console.log("[Auth] Login successful:", user.uid, user.email);
  return user;
}

export async function signOutUser() {
  const auth = getAuth();
  await signOut(auth);
  console.log("[Auth] Signed out");
}

export function getAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered.";
    case "auth/invalid-email":
      return "That email is not valid.";
    case "auth/weak-password":
      return "Password is too weak (minimum 6 characters).";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    case "auth/network-request-failed":
      return "No connection. Check your internet.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export async function signInWithGoogle() {
  const auth = getAuth();

  // 1. Config GoogleSignin
  GoogleSignin.configure({
    webClientId: "118262159405-vo20ig63ojddh6hjv4tadsjivj87ebk8.apps.googleusercontent.com",
  });

  // 2. verify Play Services
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  // 3. Sign in with Google
  await GoogleSignin.signIn();

  // 4. Obtain idToken and accessToken explicitly
  const { idToken, accessToken } = await GoogleSignin.getTokens();

  if (!idToken) {
    throw new Error("No se obtuvo idToken de Google Sign-In");
  }

  // 5. Create credential by passing BOTH tokens so Firebase doesn't throw 'accessToken cannot be empty'
  const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);

  // 6. Sign in to Firebase
  const { user } = await signInWithCredential(auth, googleCredential);
  console.log("[Auth] Google Sign-In exitoso:", user.uid, user.email);

  return user;
}

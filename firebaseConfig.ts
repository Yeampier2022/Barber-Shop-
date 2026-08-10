// Use runtime requires to avoid static import errors when packages aren't installed.
let firebaseAuth: any = null;
let db: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = require('@react-native-firebase/app');
  const auth = require('@react-native-firebase/auth');
  const firestore = require('@react-native-firebase/firestore');

  const firebaseConfig = {
    apiKey: "AIzaSyAy4pwC6bgZCJ0QkqbjPR-OMRMQdHHulV0",
    authDomain: "barber-629c0.firebaseapp.com",
    projectId: "barber-629c0",
    storageBucket: "barber-629c0.firebasestorage.app",
    messagingSenderId: "118262159405",
    appId: "1:118262159405:android:f891031447c0c4512100a4",
  };

  if (app && app.initializeApp) {
    app.initializeApp(firebaseConfig);
  }

  firebaseAuth = auth && auth.default ? auth.default() : (auth && auth()) || null;
  db = firestore && firestore.default ? firestore.default() : (firestore && firestore()) || null;
} catch (e) {
  // If firebase native packages aren't available in this environment, provide safe stubs.
  // This prevents TypeScript/IDE errors when dependencies are not installed.
  // Consumers should replace with real Firebase packages when running on device.
  // Minimal stub for reads used in the app:
  db = {
    collection: () => ({
      orderBy: () => ({
        onSnapshot: (_: any, __: any) => () => {},
      }),
    }),
    // add other methods as needed for local development
  };
  firebaseAuth = null;
}

export { firebaseAuth, db };
import {
  RobotoSlab_400Regular,
  RobotoSlab_500Medium,
  RobotoSlab_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto-slab";
import { signInWithGoogle } from "./src/services/authService";
import { createUserProfile, getUserProfile } from "./src/services/firestoreService";
import auth from "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { AppointmentsScreen } from "./src/screens/AppointmentsScreen";
import { getInitials } from "./src/utils/formatters";
import { AppView } from "./src/navigation/AppNavigator";
import { ServicesScreen } from "./src/screens/ServicesScreen";
import type { Service } from "./src/types/service";
import { calculateDuration } from "./src/utils/serviceUtils";

SplashScreen.preventAutoHideAsync();

// Show notifications with a banner + sound even while the app is open in the
// foreground (default behavior is to hide them), useful while testing.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(services[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const bookingsRef = db.collection('bookings').orderBy('datetime', 'asc');
    const unsubscribe = bookingsRef.onSnapshot((snapshot: any) => {
      const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    }, (error: any) => {
      console.warn('Error loading bookings:', error);
      Alert.alert('Error', 'No se pudieron cargar las reservas.');
    });

    return () => unsubscribe();
  }, []);

  const parsedDate = useMemo(() => {
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const candidate = new Date(year, month - 1, day, hour, minute);

    return Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day) &&
      Number.isInteger(hour) && Number.isInteger(minute) &&
      !Number.isNaN(candidate.getTime())
      ? candidate
      : null;
  }, [date, time]);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !parsedDate) {
      Alert.alert('Completa el formulario', 'Ingresa tu nombre, teléfono y una fecha válida.');
      return;
    }

    setLoading(true);

    try {
      await db.collection('bookings').add({
        name: name.trim(),
        phone: phone.trim(),
        service,
        datetime: parsedDate,
        createdAt: new Date(),
      });

      setName('');
      setPhone('');
      setDate('');
      setTime('');
      setService(services[0]);
      Alert.alert('Reserva guardada', 'Tu cita se registró correctamente.');
    } catch (error) {
      console.warn('Booking save error:', error);
      Alert.alert('Error', 'No se pudo guardar la reserva. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [fontsLoaded, fontError] = useFonts({
    RobotoSlab_400Regular,
    RobotoSlab_500Medium,
    RobotoSlab_700Bold,
  });
  const [view, setView] = useState<AppView>("welcome");
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const hasCheckedInitialAuth = useRef(false);
  const appointmentDuration = selectedService
    ? calculateDuration([selectedService])
    : 0;

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();

      const profile = await getUserProfile(user.uid);
      if (!profile) {
        await createUserProfile(user.uid, {
          name: user.displayName ?? "Google User",
          phone: user.phoneNumber ?? "",
          email: user.email ?? "",
          role: "client",
        });
      }
      setView("home");
    } catch (error) {
      console.error("[Auth] Google sign-in failed:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);

      if (!hasCheckedInitialAuth.current) {
        hasCheckedInitialAuth.current = true;
        setAuthChecked(true);

        if (firebaseUser) {
          setView("home");
        }

        return;
      }

      if (!firebaseUser) {
        setView("welcome");
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && authChecked) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, authChecked]);

  if ((!fontsLoaded && !fontError) || !authChecked) {
    return null;
  }

  const userInitials = getInitials(auth().currentUser?.displayName ?? user?.displayName);
  const handleAvatarPress = () => setView("profile");

  if (view === "welcome") {
    return <WelcomeScreen
      onLogin={() => setView("login")}
      onRegister={() => setView("register")}
      onGoogleLogin={handleGoogleSignIn}
    />;
  }

  if (view === "profile") {
    return (
      <ProfileScreen
        onBack={() => setView("home")}
        onSignedOut={() => setView("welcome")}
      />
    );
  }

  if (view === "home") {
    return (
      <HomeScreen
        userInitials={userInitials}
        onAvatarPress={handleAvatarPress}
        onNavigate={(screen) => {
          setView(screen);
        }}
      />
    );
  }

  if (view === "login") {
    return (
      <LoginScreen
        onSubmit={() => setView("home")}
        onRegister={() => setView("register")}
      />
    );
  }

  if (view === "register") {
    return (
      <RegisterScreen
        onSubmit={() => setView("home")}
        onLogin={() => setView("login")}
      />
    );
  }

  if (view === "appointments") {
    return (
      <AppointmentsScreen
        userInitials={userInitials}
        onAvatarPress={handleAvatarPress}
        selectedService={selectedService}
        appointmentDuration={appointmentDuration}
        onSelectService={setSelectedService}
        onNavigate={(screen) => setView(screen)}
      />
    );
  }

  return (
    <ServicesScreen
      userInitials={userInitials}
      onAvatarPress={handleAvatarPress}
      selectedService={selectedService}
      onSelectService={setSelectedService}
      onNavigate={(screen) => setView(screen)}
    />
  );
}

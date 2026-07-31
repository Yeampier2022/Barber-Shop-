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
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
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

export default function App() {
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

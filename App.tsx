import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { db } from './firebaseConfig';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
  RobotoSlab_400Regular,
  RobotoSlab_500Medium,
  RobotoSlab_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto-slab";
import { signInWithGoogle } from "./src/services/authService";
import {
  createUserProfile,
  getServices,
  getUserProfile,
} from "./src/services/firestoreService";
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

const services = ['Corte', 'Barba', 'Corte + Barba'];

const appStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f1e8',
  },
  scroll: {
    backgroundColor: '#f7f1e8',
  },
  pageContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#221813',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 30,
  },
  homeTitle: {
    color: '#fffdf8',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 8,
  },
  secondaryTitle: {
    color: '#eee0cb',
    fontSize: 16,
    fontWeight: '700',
  },
  openBadge: {
    backgroundColor: '#E4C178',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  pushBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pushText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },
});

const barberProfile = {
  name: 'Miguel Barber Studio',
  bio: 'Especialista en cortes clásicos, estilo moderno y cuidado personal para cada cliente.',
  phone: '+1 (555) 241-9100',
  email: 'hola@miguelbarber.com',
  hours: 'Lun a Sab · 9:00 AM - 7:00 PM',
  address: 'Calle Principal 123, Centro',
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(services[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [pushToken, setPushToken] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        if (typeof Notifications.getPermissionsAsync !== 'function') {
          return;
        }

        if (Platform.OS === 'android' && typeof Notifications.setNotificationChannelAsync === 'function') {
          await Notifications.setNotificationChannelAsync('barber-default-channel', {
            name: 'Barber Shop App',
            importance: Notifications.AndroidImportance.DEFAULT,
            sound: 'default',
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
          });
        }

        const permissions = await Notifications.getPermissionsAsync();
        let status = permissions.status;

        if (status !== 'granted') {
          const requestedPermissions = await Notifications.requestPermissionsAsync();
          status = requestedPermissions.status;
        }

        if (status === 'granted' && Platform.OS !== 'web') {
          setPushEnabled(true);
          if (typeof Notifications.getExpoPushTokenAsync === 'function') {
            const tokenData = await Notifications.getExpoPushTokenAsync();
            setPushToken(tokenData.data || '');
          }
        } else if (Platform.OS === 'web') {
          setPushEnabled(false);
        }
      } catch (error) {
        console.warn('Notifications setup error:', error);
      }
    };

    registerForPushNotifications();

    if (typeof Notifications.addNotificationReceivedListener === 'function') {
      const subscription = Notifications.addNotificationReceivedListener((notification) => {
        console.log('Received notification:', notification);
      });

      return () => subscription.remove();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsRef = db.collection('bookings').orderBy('datetime', 'asc');
      if (typeof bookingsRef.onSnapshot === 'function') {
        return;
      }

      const snapshot = await bookingsRef.get();
      const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    } catch (error: any) {
      console.warn('Error loading bookings:', error);
      Alert.alert('Error', 'No se pudieron cargar las reservas.');
    }
  };

  useEffect(() => {
    const bookingsRef = db.collection('bookings').orderBy('datetime', 'asc');
    if (typeof bookingsRef.onSnapshot === 'function') {
      const unsubscribe = bookingsRef.onSnapshot((snapshot: any) => {
        const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
      }, (error: any) => {
        console.warn('Error loading bookings:', error);
        Alert.alert('Error', 'No se pudieron cargar las reservas.');
      });

      return () => unsubscribe();
    }

    fetchBookings();

export default function App() {
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
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
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
    if (!user) {
      setServices([]);
      setSelectedService(null);
      setServicesLoading(false);
      setServicesError(null);
      return;
    }

    let cancelled = false;
    setServicesLoading(true);
    setServicesError(null);

    getServices()
      .then((availableServices) => {
        if (!cancelled) {
          setServices(availableServices);
        }
      })
      .catch((error) => {
        console.error("[Firestore] Could not load services:", error);
        if (!cancelled) {
          setServices([]);
          setServicesError("We couldn't load the services. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setServicesLoading(false);
        }
      });

      await fetchBookings();

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
    return () => {
      cancelled = true;
    };
  }, [user]);

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
        services={services}
        servicesLoading={servicesLoading}
        servicesError={servicesError}
        appointmentDuration={appointmentDuration}
        onSelectService={setSelectedService}
        onNavigate={(screen) => setView(screen)}
      />
    );
  }

  return (
    <SafeAreaView style={appStyles.safeArea} className="flex-1 bg-[#f7f1e8]">
      <StatusBar style="light" hidden={false} animated={false} />
      <ScrollView
        style={appStyles.scroll}
        contentContainerStyle={appStyles.pageContent}
        className="bg-[#f7f1e8]"
      >
        <View style={appStyles.header} className="bg-[#221813] px-6 py-8">
          <View className="flex-row items-center justify-between">
            <View>
              <Text style={appStyles.homeTitle} className="text-4xl font-black text-white mb-2 tracking-tight">✂️ Tu Barbería</Text>
              <Text style={appStyles.secondaryTitle} className="text-lg font-semibold text-[#eee0cb]">
                Reserva tu corte de forma fácil y rápida
              </Text>
            </View>
            <View style={appStyles.openBadge} className="bg-[#E4C178] px-4 py-2 rounded-full border border-white/30">
              <Text className="text-[#231a14] font-black text-[11px]">OPEN</Text>
            </View>
          </View>
          <View className="mt-5 flex-row items-center gap-2">
            <View style={appStyles.pushBadge} className={`px-3 py-1 rounded-full ${pushEnabled ? 'bg-emerald-500' : 'bg-red-500'}`}> 
              <Text style={appStyles.pushText} className="text-white text-[11px] font-black">{pushEnabled ? 'PUSH ON' : 'PUSH OFF'}</Text>
            </View>
            {pushToken ? (
              <Text className="text-[#e8d7b6] text-xs font-medium">{pushToken.slice(0, 12)}...</Text>
            ) : null}
          </View>
        </View>

        <View className="px-6 py-8">
          <View className="bg-gradient-to-br from-slate-900 to-[#38261d] rounded-[32px] border border-amber-300 shadow-md overflow-hidden">
            <View className="bg-amber-500 px-5 py-3">
              <Text className="text-stone-950 font-black text-sm uppercase tracking-widest">Barber Profile</Text>
            </View>

            <View className="p-5">
              <View className="flex-row items-center gap-4">
                <View className="rounded-full border-4 border-amber-300 p-1 bg-white">
                  <Image
                    source={require('./assets/icon.png')}
                    className="w-24 h-24 rounded-full"
                    style={{ width: 88, height: 88, borderRadius: 44 }}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-2xl font-black text-white">{barberProfile.name}</Text>
                  <Text className="text-sm font-bold text-amber-200 mt-1">Barber Master</Text>
                  <View className="mt-2 flex-row items-center">
                    <View className="bg-emerald-500 px-3 py-1 rounded-full">
                      <Text className="text-white text-[10px] font-black">OPEN TODAY</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="mt-5 bg-white/10 rounded-2xl p-4 border border-white/10">
                <Text className="text-sm font-black text-amber-200 mb-2">Sobre el barbero</Text>
                <Text className="text-slate-100 text-sm leading-6">{barberProfile.bio}</Text>
              </View>

              <View className="mt-5 gap-3 border-t border-white/10 pt-4">
                <View className="flex-row items-center gap-3">
                  <View className="bg-amber-100 rounded-full w-8 h-8 items-center justify-center">
                    <Text className="text-slate-900 text-sm">📞</Text>
                  </View>
                  <Text className="text-slate-100 font-semibold">{barberProfile.phone}</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <View className="bg-amber-100 rounded-full w-8 h-8 items-center justify-center">
                    <Text className="text-slate-900 text-sm">✉️</Text>
                  </View>
                  <Text className="text-slate-100 font-semibold">{barberProfile.email}</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <View className="bg-amber-100 rounded-full w-8 h-8 items-center justify-center">
                    <Text className="text-slate-900 text-sm">📍</Text>
                  </View>
                  <Text className="text-slate-100 font-semibold">{barberProfile.address}</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <View className="bg-amber-100 rounded-full w-8 h-8 items-center justify-center">
                    <Text className="text-slate-900 text-sm">⏰</Text>
                  </View>
                  <Text className="text-slate-100 font-semibold">{barberProfile.hours}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Booking Form Section */}
        <View className="px-6 py-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-black text-slate-900">Nueva Reserva</Text>
            <View className="bg-[#efe1c5] px-4 py-2 rounded-full border border-[#b98a35]">
              <Text className="text-[#431f08] font-black text-[11px]">BARBERIA</Text>
            </View>
          </View>
          
          <View className="bg-white rounded-[28px] border border-[#dfd4be] shadow-md p-6 space-y-6">
            {/* Name Input */}
            <View>
              <Text className="text-sm font-black text-slate-700 mb-2">Nombre</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                placeholderTextColor="#cbd5e1"
                className="border border-[#d6cfc2] rounded-2xl px-4 py-3 text-base text-slate-900 bg-[#fbfaf8]"
              />
            </View>

            {/* Phone Input */}
            <View>
              <Text className="text-sm font-black text-slate-700 mb-2">Teléfono</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Ej. 123456789"
                placeholderTextColor="#cbd5e1"
                keyboardType="phone-pad"
                className="border border-[#d6cfc2] rounded-2xl px-4 py-3 text-base text-slate-900 bg-[#fbfaf8]"
              />
            </View>

            {/* Service Selection */}
            <View>
              <Text className="text-sm font-black text-slate-700 mb-3">Servicio</Text>
              <View className="flex-row gap-2">
                {services.map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setService(option)}
                    className={`flex-1 py-3 px-2 rounded-2xl border ${
                      service === option
                        ? 'bg-[#221813] border-[#221813]'
                        : 'bg-[#f6efe7] border-[#d6cfc2]'
                    }`}>
                    <Text className={`text-center font-black ${
                      service === option ? 'text-white' : 'text-slate-700'
                    }`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Input */}
            <View>
              <Text className="text-sm font-black text-slate-700 mb-2">Fecha</Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#cbd5e1"
                className="border border-[#d6cfc2] rounded-2xl px-4 py-3 text-base text-slate-900 bg-[#fbfaf8]"
              />
              <Text className="text-xs text-slate-500 mt-1">Formato: 2026-07-25</Text>
            </View>

            {/* Time Input */}
            <View>
              <Text className="text-sm font-black text-slate-700 mb-2">Hora</Text>
              <TextInput
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
                placeholderTextColor="#cbd5e1"
                className="border border-[#d6cfc2] rounded-2xl px-4 py-3 text-base text-slate-900 bg-[#fbfaf8]"
              />
              <Text className="text-xs text-slate-500 mt-1">Formato: 14:30</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`py-4 px-6 rounded-2xl ${
                loading ? 'bg-[#b99240]' : 'bg-[#2d2119]'
              }`}>
              {loading ? (
                <View className="flex-row justify-center items-center gap-2">
                  <ActivityIndicator color="white" />
                  <Text className="text-white font-black text-base">Guardando...</Text>
                </View>
              ) : (
                <Text className="text-white font-black text-base text-center">
                  Guardar Cita
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Bookings Section */}
        <View className="px-6 py-8">
          <Text className="text-2xl font-bold text-slate-900 mb-6">
            📅 Citas Próximas ({bookings.length})
          </Text>
          
          {bookings.length === 0 ? (
            <View className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 items-center">
              <Text className="text-lg font-semibold text-amber-900 mb-2">
                Sin reservas aún
              </Text>
              <Text className="text-amber-700 text-center">
                Agrega tu primera cita usando el formulario arriba
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {bookings.map(booking => (
                <View 
                  key={booking.id}
                  className="bg-white border-l-4 border-blue-600 rounded-lg p-4 shadow-sm">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-slate-900">
                        {booking.name}
                      </Text>
                      <Text className="text-blue-600 font-semibold text-base mt-1">
                        {booking.service}
                      </Text>
                    </View>
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-green-700 text-xs font-bold">CONFIRMADO</Text>
                    </View>
                  </View>
                  <View className="gap-2 border-t border-slate-200 pt-3">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-slate-600 text-sm">📞</Text>
                      <Text className="text-slate-600 font-medium">{booking.phone}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-slate-600 text-sm">🕐</Text>
                      <Text className="text-slate-600 font-medium">
                        {booking.datetime ? formatDate(new Date(booking.datetime.seconds ? booking.datetime.toDate() : booking.datetime)) : 'Fecha no disponible'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
    <ServicesScreen
      userInitials={userInitials}
      onAvatarPress={handleAvatarPress}
      selectedService={selectedService}
      services={services}
      servicesLoading={servicesLoading}
      servicesError={servicesError}
      onSelectService={setSelectedService}
      onNavigate={(screen) => setView(screen)}
    />
  );
}

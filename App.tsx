/* @ts-nocheck */
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from './firebaseConfig';

const services = ['Corte', 'Barba', 'Corte + Barba'];

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
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} className="bg-slate-50">
        {/* Header Section */}
        <View className="bg-gradient-to-b from-blue-900 to-blue-800 px-6 py-8">
          <Text className="text-4xl font-bold text-white mb-2">✂️ Tu Barbería</Text>
          <Text className="text-lg text-blue-100">
            Reserva tu corte de forma fácil y rápida
          </Text>
        </View>

        {/* Booking Form Section */}
        <View className="px-6 py-8">
          <Text className="text-2xl font-bold text-slate-900 mb-6">Nueva Reserva</Text>
          
          <View className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Name Input */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Nombre</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                placeholderTextColor="#cbd5e1"
                className="border-2 border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900 bg-slate-50"
              />
            </View>

            {/* Phone Input */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Teléfono</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Ej. 123456789"
                placeholderTextColor="#cbd5e1"
                keyboardType="phone-pad"
                className="border-2 border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900 bg-slate-50"
              />
            </View>

            {/* Service Selection */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-3">Servicio</Text>
              <View className="flex-row gap-2">
                {services.map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setService(option)}
                    className={`flex-1 py-3 px-2 rounded-lg border-2 ${
                      service === option
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-slate-100 border-slate-200'
                    }`}>
                    <Text className={`text-center font-semibold ${
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
              <Text className="text-sm font-semibold text-slate-700 mb-2">Fecha</Text>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#cbd5e1"
                className="border-2 border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900 bg-slate-50"
              />
              <Text className="text-xs text-slate-500 mt-1">Formato: 2026-07-25</Text>
            </View>

            {/* Time Input */}
            <View>
              <Text className="text-sm font-semibold text-slate-700 mb-2">Hora</Text>
              <TextInput
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
                placeholderTextColor="#cbd5e1"
                className="border-2 border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900 bg-slate-50"
              />
              <Text className="text-xs text-slate-500 mt-1">Formato: 14:30</Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`py-4 px-6 rounded-lg ${
                loading ? 'bg-blue-400' : 'bg-blue-600'
              }`}>
              {loading ? (
                <View className="flex-row justify-center items-center gap-2">
                  <ActivityIndicator color="white" />
                  <Text className="text-white font-bold text-base">Guardando...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-base text-center">
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
  );
}

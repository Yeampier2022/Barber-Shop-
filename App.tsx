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
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text>Reserva tu corte</Text>
        <Text>
          Completa el formulario para agendar tu cita y la guardaremos en Firebase.
        </Text>

        <View>
          <View>
            <Text>Nombre</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View>
            <Text>Teléfono</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Ej. 123456789"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text>Servicio</Text>
            <View>
              {services.map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setService(option)}>
                  <Text>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text>Fecha (YYYY-MM-DD)</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="2026-07-25"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View>
            <Text>Hora (HH:MM)</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="14:30"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text>Guardar cita</Text>
            )}
          </TouchableOpacity>
        </View>

        <View>
          <Text>Citas próximas</Text>
          {bookings.length === 0 ? (
            <Text>No hay reservas todavía. Agrega una cita arriba.</Text>
          ) : (
            bookings.map(booking => (
              <View key={booking.id}>
                <Text>{booking.name}</Text>
                <Text>{booking.service}</Text>
                <Text>{booking.phone}</Text>
                <Text>{booking.datetime ? formatDate(new Date(booking.datetime.seconds ? booking.datetime.toDate() : booking.datetime)) : 'Fecha no disponible'}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

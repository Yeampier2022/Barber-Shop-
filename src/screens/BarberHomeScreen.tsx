import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";

export interface AppointmentData {
  id: string;
  barberId: string;
  clientId: string;
  clientName?: string;
  serviceId: string;
  serviceName?: string;
  price: number;
  durationMinutes: number;
  startTime: string; // Formateado o ISO
  endTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface BarberHomeScreenProps {
  barberName?: string;
  barberInitials?: string;
  appointments?: AppointmentData[];
  onAvatarPress?: () => void;
  onNavigate: (screen: AppView) => void;
  onStatusChange?: (appointmentId: string, newStatus: string) => void;
}

export function BarberHomeScreen({
  barberName = "Barber",
  barberInitials = "B",
  appointments = [],
  onAvatarPress,
  onNavigate,
  onStatusChange,
}: BarberHomeScreenProps) {
  // Filtrar citas pendientes y confirmadas
  const pendingAppointments = appointments.filter(
    (app) => app.status === "pending"
  );
  const nextAppointment = appointments.find(
    (app) => app.status === "confirmed" || app.status === "pending"
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        isAuthenticated
        userInitials={barberInitials}
        onAvatarPress={onAvatarPress}
      />

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Saludo Principal */}
        <View className="mb-6">
          <Text className="font-roboto-slab-bold text-2xl text-brand-primary">
            Welcome back, {barberName.split(" ")[0]}! 💈
          </Text>
          <Text className="mt-1 font-roboto-slab text-sm text-brand-tertiary">
            You have {appointments.length} appointment(s) scheduled for today.
          </Text>
        </View>

        {/* Sección: Next Appointment (Cita Destacada) */}
        <View className="mb-6">
          <Text className="mb-3 font-roboto-slab-bold text-lg text-brand-primary">
            Next Up
          </Text>

          {nextAppointment ? (
            <View className="rounded-2xl bg-brand-primary p-5 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="rounded-md bg-amber-400 px-2.5 py-1">
                  <Text className="font-roboto-slab-bold text-[10px] uppercase text-brand-primary">
                    {nextAppointment.status}
                  </Text>
                </View>
                <Text className="font-roboto-slab-bold text-lg text-amber-300">
                  ${nextAppointment.price}
                </Text>
              </View>

              <Text className="mt-3 font-roboto-slab-bold text-xl text-white">
                {nextAppointment.serviceName || nextAppointment.serviceId}
              </Text>

              <Text className="mt-1 font-roboto-slab text-sm text-white/90">
                👤 Client ID: {nextAppointment.clientName || nextAppointment.clientId.slice(0, 8)}...
              </Text>

              <Text className="mt-1 font-roboto-slab text-xs text-white/80">
                ⏱ {nextAppointment.durationMinutes} min • {nextAppointment.startTime}
              </Text>
            </View>
          ) : (
            <View className="rounded-2xl border border-gray-100 bg-brand-neutral/40 p-5">
              <Text className="font-roboto-slab-bold text-base text-brand-primary">
                No upcoming appointments
              </Text>
              <Text className="mt-1 font-roboto-slab text-xs text-brand-tertiary">
                Your schedule is clear right now. Take a break!
              </Text>
            </View>
          )}
        </View>

        {/* Sección: Citas Pendientes de Confirmación */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-roboto-slab-bold text-lg text-brand-primary">
              Pending Requests ({pendingAppointments.length})
            </Text>
          </View>

          {pendingAppointments.length > 0 ? (
            pendingAppointments.map((item) => (
              <View
                key={item.id}
                className="mb-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <View className="mb-1.5 self-start rounded-md bg-amber-200/80 px-2 py-0.5">
                      <Text className="font-roboto-slab-bold text-[10px] text-amber-900 uppercase">
                        PENDING APPROVAL
                      </Text>
                    </View>
                    <Text className="font-roboto-slab-bold text-base text-brand-primary">
                      {item.serviceName || item.serviceId}
                    </Text>
                    <Text className="mt-0.5 font-roboto-slab text-xs text-brand-tertiary">
                      ⏱ {item.durationMinutes} min • ${item.price}
                    </Text>
                  </View>

                  <Text className="font-roboto-slab-bold text-xs text-brand-primary">
                    {item.startTime}
                  </Text>
                </View>

                {/* Botones de Acción Rápida */}
                <View className="mt-4 flex-row justify-end space-x-2" style={{ gap: 8 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="rounded-xl border border-red-200 bg-white px-4 py-2"
                    onPress={() => onStatusChange?.(item.id, "cancelled")}
                  >
                    <Text className="font-roboto-slab-medium text-xs text-red-600">
                      Decline
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="rounded-xl bg-brand-primary px-4 py-2"
                    onPress={() => onStatusChange?.(item.id, "confirmed")}
                  >
                    <Text className="font-roboto-slab-medium text-xs text-white">
                      Accept
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text className="font-roboto-slab text-xs text-brand-tertiary italic">
              No pending requests at the moment.
            </Text>
          )}
        </View>

        {/* Bottom Spacer */}
        <View className="h-10" />
      </ScrollView>

      <BottomNav
        active="Home"
        onChange={(tab) => {
          if (tab === "Profile") onNavigate("profile");
          if (tab === "Appointments") onNavigate("appointments");
          if (tab === "Services") onNavigate("services");
          if (tab === "Home") onNavigate("home");
        }}
      />
    </SafeAreaView>
  );
}
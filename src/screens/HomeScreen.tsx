import { getAuth } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";
import { getMockReservations, MOCK_CURRENT_CLIENT_ID, type Reservation } from "../mocks/reservations";
import { getUserProfile } from "../services/firestoreService";
import type { UserRole } from "../types/user";
import { formatDayHeading, formatTime, isSameDay } from "../utils/dateUtils";

type ReservationGroup = {
  day: Date;
  items: Reservation[];
};

function groupReservationsByDay(reservations: Reservation[]): ReservationGroup[] {
  const groups: ReservationGroup[] = [];

  for (const reservation of reservations) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && isSameDay(lastGroup.day, reservation.start)) {
      lastGroup.items.push(reservation);
    } else {
      groups.push({ day: reservation.start, items: [reservation] });
    }
  }

  return groups;
}

export interface HomeScreenProps {
  userInitials?: string;
  onAvatarPress?: () => void;
  onNavigate: (screen: AppView) => void;
}

export function HomeScreen({ userInitials = "?", onAvatarPress, onNavigate }: HomeScreenProps) {
  const [role, setRole] = useState<UserRole>("client");
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const currentUser = getAuth().currentUser;

    if (!currentUser) {
      setLoadingRole(false);
      return;
    }

    getUserProfile(currentUser.uid)
      .then((profile) => {
        if (!cancelled && profile) {
          setRole(profile.role);
        }
      })
      .catch((error) => {
        console.error("[Home] Could not load user role:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingRole(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isBarber = role === "barber";
  const allReservations = getMockReservations(new Date());
  const reservations = isBarber
    ? allReservations
    : allReservations.filter((reservation) => reservation.clientId === MOCK_CURRENT_CLIENT_ID);
  const reservationGroups = groupReservationsByDay(reservations);

  return (
    <View className="flex-1 bg-white">
      <Header
        isAuthenticated
        userInitials={userInitials}
        onAvatarPress={onAvatarPress}
      />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="font-roboto-slab-bold text-2xl text-brand-primary">
          Welcome back
        </Text>
        <Text className="mt-1 font-roboto-slab text-base text-brand-tertiary">
          {isBarber ? "Your upcoming appointments" : "Your upcoming reservations"}
        </Text>

        {loadingRole ? null : reservations.length === 0 ? (
          <View className="mt-6 rounded-2xl bg-brand-neutral p-4">
            <Text className="font-roboto-slab-bold text-brand-primary">
              No upcoming appointments
            </Text>
            <Text className="mt-1 font-roboto-slab text-sm text-brand-tertiary">
              Book your next haircut from the Services tab.
            </Text>
          </View>
        ) : (
          <View className="mt-6" style={{ gap: 20 }}>
            {reservationGroups.map((group) => (
              <View key={group.day.toISOString()}>
                <Text className="font-roboto-slab-bold text-base text-brand-primary">
                  {formatDayHeading(group.day)}
                </Text>
                <View className="mt-2" style={{ gap: 8 }}>
                  {/* TODO: once bookings are real, a barber tapping a card here should be
                      able to Accept/Decline, and that decision should trigger a push
                      notification to the client via notificationService.ts. */}
                  {group.items.map((reservation) => (
                    <View
                      key={reservation.id}
                      className="rounded-2xl bg-brand-neutral p-4"
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="font-roboto-slab-bold text-brand-primary">
                          {formatTime(reservation.start)}
                        </Text>
                        <Text className="font-roboto-slab text-sm text-brand-tertiary">
                          {isBarber
                            ? `${reservation.clientName} · ${reservation.service.name}`
                            : `${reservation.barber.name} · ${reservation.service.name}`}
                        </Text>
                      </View>
                      <Text className="mt-1 font-roboto-slab text-xs text-brand-tertiary">
                        {isBarber ? reservation.phone : reservation.barber.phone}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNav
        active="Home"
        onChange={(tab) => {
          if (tab === "Profile") {
            onNavigate("profile");
          }
          if (tab === "Appointments") {
            onNavigate("appointments");
          }
          if (tab === "Services") {
            onNavigate("services");
          }
          if (tab === "Home") {
            onNavigate("home");
          }
        }}
      />
    </View>
  );
}

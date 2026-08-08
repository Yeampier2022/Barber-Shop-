import { getAuth } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";
import {
  getReservations,
  getUserProfile,
  updateAppointmentStatus,
  updatePushToken,
  type AppointmentStatus,
  type ReservationDoc,
} from "../services/firestoreService";
import { notifyUser, registerForPushNotifications } from "../services/notificationService";
import { colors } from "../theme/colors";
import type { UserRole } from "../types/user";
import { cn } from "../utils/cn";
import { formatDayHeading, formatTime, isSameDay } from "../utils/dateUtils";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined",
};

const STATUS_CLASSES: Record<AppointmentStatus, string> = {
  pending: "text-amber-600",
  approved: "text-green-600",
  declined: "text-red-500",
};

export interface HomeScreenProps {
  userInitials?: string;
  onAvatarPress?: () => void;
  onNavigate: (screen: AppView) => void;
}

type ParsedReservation = ReservationDoc & { start: Date };

type ReservationGroup = {
  day: Date;
  items: ParsedReservation[];
};

// Firestore may hand back a Timestamp (has .toDate()) or, in theory, a plain
// Date. Anything else means the doc doesn't have a usable start time yet.
function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}

function parseReservations(docs: ReservationDoc[]): ParsedReservation[] {
  return docs
    .map((doc) => ({ ...doc, start: toDate(doc.startTime) ?? toDate(doc.date) }))
    .filter((doc): doc is ParsedReservation => doc.start !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

function groupReservationsByDay(reservations: ParsedReservation[]): ReservationGroup[] {
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

type Contact = { name?: string; phone?: string };

export function HomeScreen({ userInitials = "?", onAvatarPress, onNavigate }: HomeScreenProps) {
  const [role, setRole] = useState<UserRole>("client");
  const [reservations, setReservations] = useState<ParsedReservation[]>([]);
  const [contactById, setContactById] = useState<Record<string, Contact>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const currentUser = getAuth().currentUser;

    if (!currentUser) {
      setLoading(false);
      return;
    }

    getUserProfile(currentUser.uid)
      .then(async (profile) => {
        const resolvedRole = profile?.role ?? "client";
        if (cancelled) {
          return;
        }
        setRole(resolvedRole);

        const field = resolvedRole === "barber" ? "barberId" : "clientId";
        const docs = await getReservations(field, currentUser.uid);
        console.log(`[Home] role=${resolvedRole}, reservations found: ${docs.length}`);

        if (cancelled) {
          return;
        }
        const parsed = parseReservations(docs);
        setReservations(parsed);

        // Resolve the other party's name + phone (client sees the barber's,
        // barber sees the client's) — falls back to the raw id if there's no
        // matching users/{uid} doc (e.g. old mock barberIds).
        const otherField = resolvedRole === "barber" ? "clientId" : "barberId";
        const otherIds = Array.from(
          new Set(parsed.map((r) => r[otherField] as string | undefined).filter(Boolean))
        ) as string[];

        const entries = await Promise.all(
          otherIds.map(async (uid) => {
            const otherProfile = await getUserProfile(uid).catch(() => null);
            return [uid, { name: otherProfile?.name, phone: otherProfile?.phone }] as const;
          })
        );

        if (!cancelled) {
          const map: Record<string, Contact> = {};
          for (const [uid, contact] of entries) {
            map[uid] = contact;
          }
          setContactById(map);
        }
      })
      .catch((error) => {
        console.error("[Home] Could not load reservations:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      return;
    }

    registerForPushNotifications()
      .then((token) => {
        if (token) {
          return updatePushToken(currentUser.uid, token);
        }
      })
      .catch((error) => {
        console.error("[Home] Could not save push token:", error);
      });
  }, []);

  async function handleDecision(reservation: ParsedReservation, status: "approved" | "declined") {
    setUpdatingId(reservation.id);
    try {
      await updateAppointmentStatus(reservation.id, status);
      setReservations((prev) =>
        prev.map((r) => (r.id === reservation.id ? { ...r, status } : r))
      );

      if (reservation.clientId) {
        const barberName = getAuth().currentUser?.displayName ?? "Your barber";
        const title = status === "approved" ? "Appointment confirmed" : "Appointment declined";
        const body =
          status === "approved"
            ? `${barberName} confirmed your appointment.`
            : `${barberName} declined your appointment request.`;
        notifyUser(reservation.clientId, title, body).catch((error) => {
          console.error("[Home] Could not notify client:", error);
        });
      }
    } catch (error) {
      console.error(`[Home] Could not set appointment ${reservation.id} to ${status}:`, error);
    } finally {
      setUpdatingId(null);
    }
  }

  const isBarber = role === "barber";
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

        {loading ? (
          <View className="mt-10 items-center" style={{ gap: 8 }}>
            <ActivityIndicator color={colors.primary} />
            <Text className="font-roboto-slab text-sm text-brand-tertiary">
              Loading your {isBarber ? "appointments" : "reservations"}…
            </Text>
          </View>
        ) : reservationGroups.length === 0 ? (
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
                  {group.items.map((reservation) => {
                    const status = reservation.status ?? "pending";
                    const otherId = (isBarber ? reservation.clientId : reservation.barberId) ?? "";
                    const contact = contactById[otherId];
                    return (
                    <View key={reservation.id} className="rounded-2xl bg-brand-neutral p-4">
                      <View className="flex-row items-center justify-between">
                        <Text className="font-roboto-slab-bold text-brand-primary">
                          {formatTime(reservation.start)}
                        </Text>
                        <Text className={cn("font-roboto-slab-bold text-xs", STATUS_CLASSES[status])}>
                          {STATUS_LABELS[status]}
                        </Text>
                      </View>
                      <Text className="mt-1 font-roboto-slab-bold text-sm text-brand-tertiary">
                        {isBarber ? "Client: " : "Barber: "}
                        {contact?.name ?? otherId ?? "—"}
                      </Text>
                      {contact?.phone ? (
                        <Text className="mt-0.5 font-roboto-slab-bold text-xs text-brand-tertiary">
                          {contact.phone}
                        </Text>
                      ) : null}
                      {reservation.serviceId ? (
                        <Text className="mt-1 font-roboto-slab-bold text-xs text-brand-tertiary">
                          {reservation.serviceId}
                          {typeof reservation.price === "number" ? ` · $${reservation.price}` : ""}
                        </Text>
                      ) : null}
                      {isBarber && status === "pending" ? (
                        <View className="mt-3 flex-row" style={{ gap: 8 }}>
                          <Button
                            size="sm"
                            className="flex-1"
                            loading={updatingId === reservation.id}
                            disabled={updatingId === reservation.id}
                            onPress={() => handleDecision(reservation, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            disabled={updatingId === reservation.id}
                            onPress={() => handleDecision(reservation, "declined")}
                          >
                            Decline
                          </Button>
                        </View>
                      ) : null}
                    </View>
                    );
                  })}
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

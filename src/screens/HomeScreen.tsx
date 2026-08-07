import { getAuth } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";
import {
  getReservations,
  getUserProfile,
  type AppointmentStatus,
  type ReservationDoc,
} from "../services/firestoreService";
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

        {loading ? null : reservationGroups.length === 0 ? (
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
            {/* TODO: once bookings can be accepted/declined, a barber tapping a
                card here should trigger that decision and a push notification
                to the client via notificationService.ts. */}
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
                      <Text className="mt-1 font-roboto-slab text-sm text-brand-tertiary">
                        {isBarber ? "Client: " : "Barber: "}
                        {contact?.name ?? otherId ?? "—"}
                      </Text>
                      {contact?.phone ? (
                        <Text className="mt-0.5 font-roboto-slab text-xs text-brand-tertiary">
                          {contact.phone}
                        </Text>
                      ) : null}
                      {reservation.serviceId ? (
                        <Text className="mt-1 font-roboto-slab text-xs text-brand-tertiary">
                          {reservation.serviceId}
                          {typeof reservation.price === "number" ? ` · $${reservation.price}` : ""}
                        </Text>
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

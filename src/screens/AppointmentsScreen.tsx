import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";
import { addMinutes, addMonths, subMonths } from "date-fns";
import { getAuth } from "@react-native-firebase/auth";
import { MonthDisplay } from "../components/appointments/DateSelect/MonthDisplay";
import { MonthHeader } from "../components/appointments/DateSelect/MonthHeader";
import { WeekStrip } from "../components/appointments/DateSelect/WeekStrip";
import { ScheduleDisplay } from "../components/appointments/Schedule/ScheduleDisplay";
import { ServiceSelect } from "../components/appointments/ServiceSelect";
import { BarberSelect } from "../components/appointments/BarberSelect";
import { OrderSummaryModal } from "../components/appointments/OrderSummaryModal";
import { getMockAppointments } from "../mocks/appointments";
import { notifyUser } from "../services/notificationService";
import { CalendarToggle } from "../components/appointments/DateSelect/CalendarToggle";
import { BottomNav } from "../components/BottomNav";
import { Button } from "../components";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";
import {
  createAppointment,
  getBarbers,
  subscribeToBarberAppointments,
} from "../services/firestoreService";
import { colors } from "../theme/colors";
import type { Barber } from "../types/barber";
import type { Appointment } from "../types/schedule";
import type { Service } from "../types/service";
import { doesOverlap } from "../utils/scheduleUtils";

export interface AppointmentsScreenProps {
  userInitials?: string;
  onAvatarPress?: () => void;
  selectedService: Service | null;
  services: Service[];
  servicesLoading: boolean;
  servicesError: string | null;
  appointmentDuration: number;
  onSelectService: (service: Service | null) => void;
  onNavigate: (screen: AppView) => void;
}

type CalendarMode = "week" | "month";

const MOCK_SCHEDULE = {
  startHour: 9,
  endHour: 17,
  slotLength: 30,
};

export function AppointmentsScreen({
  userInitials = "?",
  onAvatarPress,
  selectedService,
  services,
  servicesLoading,
  servicesError,
  appointmentDuration,
  onSelectService,
  onNavigate,
}: AppointmentsScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("week");
  const [isReviewVisible, setIsReviewVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [barberAppointments, setBarberAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setDisplayMonth(date);
  };

  useEffect(() => {
    setSelectedStartTime(null);
    setSubmitError(null);
  }, [selectedDate, selectedService?.id, selectedBarber?.id]);

  useEffect(() => {
    getBarbers()
      .then((barberProfiles) => {
        setBarbers(
          barberProfiles.map((profile) => ({
            id: profile.uid,
            name: profile.name,
            phone: profile.phone,
          }))
        );
      })
      .catch((error) => {
        console.error("[Appointments] Could not load barbers:", error);
      });
  }, []);

  useEffect(() => {
    if (!selectedBarber) {
      setBarberAppointments([]);
      setAppointmentsError(null);
      setIsLoadingAppointments(false);
      return;
    }

    setBarberAppointments([]);
    setAppointmentsError(null);
    setIsLoadingAppointments(true);

    return subscribeToBarberAppointments(
      selectedBarber.id,
      selectedDate,
      (appointments) => {
        setBarberAppointments(appointments);
        setAppointmentsError(null);
        setIsLoadingAppointments(false);
      },
      () => {
        setBarberAppointments([]);
        setAppointmentsError(
          "We couldn't load this barber's appointments. Please try again."
        );
        setIsLoadingAppointments(false);
      }
    );
  }, [selectedBarber, selectedDate]);

  useEffect(() => {
    if (!selectedStartTime) {
      return;
    }

    const selectedSlot = {
      start: selectedStartTime,
      end: addMinutes(selectedStartTime, appointmentDuration),
      isBookable: true,
    };

    if (
      barberAppointments.some((appointment) =>
        doesOverlap(selectedSlot, appointment)
      )
    ) {
      setSelectedStartTime(null);
      setIsReviewVisible(false);
    }
  }, [appointmentDuration, barberAppointments, selectedStartTime]);

  async function handleConfirmAppointment() {
    const currentUser = getAuth().currentUser;

    if (
      isSubmitting ||
      !selectedService ||
      !selectedBarber ||
      !selectedStartTime ||
      !currentUser
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createAppointment({
        barberId: selectedBarber.id,
        clientId: currentUser.uid,
        serviceId: selectedService.id,
        price: selectedService.price,
        durationMinutes: appointmentDuration,
        startTime: selectedStartTime,
        endTime: addMinutes(selectedStartTime, appointmentDuration),
      });

      setIsReviewVisible(false);
      Alert.alert("Appointment requested", "We'll let you know once the barber confirms it.");

      notifyUser(
        selectedBarber.id,
        "New appointment request",
        `${currentUser.displayName ?? "A client"} requested a ${selectedService.name} appointment.`
      ).catch((error) => {
        console.error("[Appointments] Could not notify barber:", error);
      });

      setSelectedStartTime(null);
      onSelectService(null);
      setSelectedBarber(null);
      Alert.alert(
        "Appointment requested",
        "We'll let you know once the barber confirms it."
      );
    } catch (error) {
      console.error("[Appointments] Could not create appointment:", error);
      setSubmitError("We couldn't book that appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1">
      <Header
        isAuthenticated
        userInitials={userInitials}
        onAvatarPress={onAvatarPress}
      />

      <ScrollView className="flex-1 px-3">
        <View className="px-4 py-4">
          {servicesLoading ? (
            <Text className="py-4 text-center font-roboto-slab text-brand-tertiary">
              Loading services...
            </Text>
          ) : servicesError ? (
            <Text className="py-4 text-center font-roboto-slab text-brand-secondary">
              {servicesError}
            </Text>
          ) : services.length === 0 ? (
            <Text className="py-4 text-center font-roboto-slab text-brand-tertiary">
              No services are currently available.
            </Text>
          ) : (
            <ServiceSelect
              services={services}
              selectedService={selectedService}
              onSelectService={onSelectService}
            />
          )}
          <View className="mt-5">
            <BarberSelect
              barbers={barbers}
              selectedBarber={selectedBarber}
              onSelectBarber={setSelectedBarber}
            />
          </View>
        </View>
        <View className="my-3 h-px bg-brand-border" />
        <View className="px-4 py-3">
          <CalendarToggle mode={calendarMode} onChange={setCalendarMode} />
        </View>
        <View className="mb-3 h-px bg-brand-border" />
        <View>
          {calendarMode === "week" ? (
            <WeekStrip
              selectedDate={selectedDate}
              weekStart={weekStart}
              onSelectDate={handleSelectDate}
            />
          ) : (
            <View>
              <MonthHeader
                month={displayMonth}
                onPreviousMonth={() => {
                  setDisplayMonth(subMonths(displayMonth, 1));
                }}
                onNextMonth={() => {
                  setDisplayMonth(addMonths(displayMonth, 1));
                }}
              />
              <MonthDisplay
                month={displayMonth}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
              />
            </View>
          )}
        </View>
        <View className="my-4 h-px bg-brand-border" />
        <View>
          {selectedService && selectedBarber && isLoadingAppointments ? (
            <View className="items-center py-8">
              <ActivityIndicator color={colors.primary} />
              <Text className="mt-2 font-roboto-slab text-sm text-brand-tertiary">
                Loading available times...
              </Text>
            </View>
          ) : selectedService && selectedBarber && appointmentsError ? (
            <Text className="px-4 py-6 text-center font-roboto-slab-medium text-brand-secondary">
              {appointmentsError}
            </Text>
          ) : selectedService && selectedBarber ? (
            <ScheduleDisplay
              day={selectedDate}
              startHour={MOCK_SCHEDULE.startHour}
              endHour={MOCK_SCHEDULE.endHour}
              slotLength={MOCK_SCHEDULE.slotLength}
              appointments={barberAppointments}
              appointmentDuration={appointmentDuration}
              selectedStartTime={selectedStartTime}
              onSlotPress={(slot) => setSelectedStartTime(slot.start)}
            />
          ) : (
            <Text className="py-6 text-center font-roboto-slab-medium text-brand-tertiary">
              Select a service and barber to view available times.
            </Text>
          )}
        </View>
      </ScrollView>

      <View className="border-t border-brand-border bg-white px-6 py-3">
        <Button
          variant="solid"
          size="md"
          fullWidth
          onPress={() => setIsReviewVisible(true)}
          disabled={
            !selectedStartTime ||
            !selectedService ||
            !selectedBarber ||
            isLoadingAppointments ||
            Boolean(appointmentsError)
          }
        >
          Review Order
        </Button>
      </View>

      {selectedService && selectedBarber && selectedStartTime ? (
        <OrderSummaryModal
          visible={isReviewVisible}
          service={selectedService}
          barber={selectedBarber}
          date={selectedDate}
          startTime={selectedStartTime}
          duration={appointmentDuration}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onClose={() => {
            setSubmitError(null);
            setIsReviewVisible(false);
          }}
          onConfirm={handleConfirmAppointment}
        />
      ) : null}

      <BottomNav
        active="Appointments"
        onChange={(tab) => onNavigate(tab.toLowerCase() as AppView)}
      />
    </View>
  );
}

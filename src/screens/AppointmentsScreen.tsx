import { useState, useEffect } from "react";
import { ActivityIndicator, View, ScrollView, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import {
  createAppointment,
  subscribeToBarberAppointments,
} from "../services/firestoreService";
import { subMonths, addMonths, addMinutes } from "date-fns";
import { WeekStrip } from "../components/appointments/DateSelect/WeekStrip";
import { MonthDisplay } from "../components/appointments/DateSelect/MonthDisplay";
import { MonthHeader } from "../components/appointments/DateSelect/MonthHeader";
import { ScheduleDisplay } from "../components/appointments/Schedule/ScheduleDisplay";
import { ServiceSelect } from "../components/appointments/ServiceSelect";
import { BarberSelect } from "../components/appointments/BarberSelect";
import { OrderSummaryModal } from "../components/appointments/OrderSummaryModal";
import { mockServices } from "../mocks/services";
import { mockBarbers } from "../mocks/barbers";
import { CalendarToggle } from "../components/appointments/DateSelect/CalendarToggle";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";
import type { Service } from "../types/service";
import type { Barber } from "../types/barber";
import type { Appointment } from "../types/schedule";
import { Button } from "../components";
import { colors } from "../theme/colors";
import { doesOverlap } from "../utils/scheduleUtils";

export interface AppointmentsScreenProps {
  userInitials?: string;
  onAvatarPress?: () => void;
  selectedService: Service | null;
  appointmentDuration: number;
  onSelectService: (service: Service | null) => void;
  onNavigate: (screen: AppView) => void;
}

type CalendarMode = "week" | "month";

const MOCK_SCHEDULE = {
  startHour: 9,
  endHour: 17,
  slotLength: 30,
}

export function AppointmentsScreen({
  userInitials = "?",
  onAvatarPress,
  selectedService,
  appointmentDuration,
  onSelectService,
  onNavigate,
}: AppointmentsScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("week");
  const [isReviewVisible, setIsReviewVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [barberAppointments, setBarberAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setDisplayMonth(date);
  };

  const handleConfirmAppointment = async () => {
    const currentUser = auth().currentUser;

    if (
      isSubmitting ||
      !currentUser ||
      !selectedService ||
      !selectedBarber ||
      !selectedStartTime
    ) {
      return;
    }

    const endTime = addMinutes(
      selectedStartTime,
      appointmentDuration
    );

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const appointmentId = await createAppointment({
        clientId: currentUser.uid,
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        startTime: selectedStartTime,
        endTime,
        durationMinutes: appointmentDuration,
        price: selectedService.price,
      });

      console.log("Appointment Created:", appointmentId);
      setIsReviewVisible(false);
      setSelectedStartTime(null);
    } catch (error) {
      console.error("[Appointments] Creation failed:", error);
      setSubmitError("We couldn't book that appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    setSelectedStartTime(null);
    setSubmitError(null);
  }, [selectedDate, selectedService?.id, selectedBarber?.id]);

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

  return (
    <View className="flex-1">
      <Header
        isAuthenticated
        userInitials={userInitials}
        onAvatarPress={onAvatarPress}
      />

      <ScrollView className="flex-1 px-3">
        <View className="px-4 py-4">
          <ServiceSelect
            services={mockServices}
            selectedService={selectedService}
            onSelectService={onSelectService}
          />
          <View className="mt-5">
            <BarberSelect
              barbers={mockBarbers}
              selectedBarber={selectedBarber}
              onSelectBarber={setSelectedBarber}
            />
          </View>
        </View>
        <View className="h-px bg-brand-border my-3" />
        <View
          className="px-4 py-3"
        >
          <CalendarToggle
            mode={calendarMode}
            onChange={setCalendarMode}
          />
        </View>
        <View className="h-px bg-brand-border mb-3" />
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
        <View className="h-px bg-brand-border my-4" />
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
      {selectedService &&
        selectedBarber &&
        selectedStartTime && (
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
        )}

      <BottomNav
        active="Appointments"
        onChange={(tab) => onNavigate(tab.toLowerCase() as AppView)}
      />
    </View>
  );
}

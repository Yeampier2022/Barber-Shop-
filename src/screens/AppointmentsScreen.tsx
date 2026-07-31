import { useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import { createAppointment } from "../services/firestoreService";
import { subMonths, addMonths, addMinutes } from "date-fns";
import { WeekStrip } from "../components/appointments/DateSelect/WeekStrip";
import { MonthDisplay } from "../components/appointments/DateSelect/MonthDisplay";
import { MonthHeader } from "../components/appointments/DateSelect/MonthHeader";
import { ScheduleDisplay } from "../components/appointments/Schedule/ScheduleDisplay";
import { ServiceSelect } from "../components/appointments/ServiceSelect";
import { BarberSelect } from "../components/appointments/BarberSelect";
import { OrderSummaryModal } from "../components/appointments/OrderSummaryModal";
import { getMockAppointments } from "../mocks/appointments";
import { mockServices } from "../mocks/services";
import { mockBarbers } from "../mocks/barbers";
import { CalendarToggle } from "../components/appointments/DateSelect/CalendarToggle";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";
import type { Service } from "../types/service";
import type { Barber } from "../types/barber";
import { Button } from "../components";

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

const appointments = getMockAppointments(new Date()); 




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
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const barberAppointments = selectedBarber
    ? appointments.filter(
      (appointment) => appointment.barberId === selectedBarber.id
    )
    : [];
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setDisplayMonth(date);
  };

  const handleConfirmAppointment = async () => {
    const currentUser = auth().currentUser;

    if (
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
    const appointmentId = await createAppointment({
      clientId: currentUser.uid,
      barberId: selectedBarber.id,
      serviceId: selectedService.id,
      startTime: selectedStartTime,
      endTime,
      durationMinutes: appointmentDuration,
      price: selectedService.price,
      isConfirmed: false
    });

    console.log("Appointment Created:", appointmentId);
    setIsReviewVisible(false);  
  }
  
  useEffect(() => {
    setSelectedStartTime(null);
  }, [selectedDate, selectedService?.id, selectedBarber?.id]);

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
          {selectedService && selectedBarber ? (
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
          disabled={!selectedStartTime || !selectedService || !selectedBarber}
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
            onClose={() => setIsReviewVisible(false)}
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

import { useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { subMonths, addMonths } from "date-fns";
import { WeekStrip } from "../components/appointments/DateSelect/WeekStrip";
import { MonthDisplay } from "../components/appointments/DateSelect/MonthDisplay";
import { MonthHeader } from "../components/appointments/DateSelect/MonthHeader";
import { ScheduleDisplay } from "../components/appointments/Schedule/ScheduleDisplay";
import { ServiceDisplay } from "../components/services/ServiceDisplay";
import { getMockAppointments } from "../mocks/appointments";
import { mockServices } from "../mocks/services";
import { CalendarToggle } from "../components/appointments/DateSelect/CalendarToggle";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";
import type { Service } from "../types/service";

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
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("week");
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date); 
    setDisplayMonth(date);
  };
  
  useEffect(() => {
    setSelectedStartTime(null);
  }, [selectedDate, selectedService?.id]);

  
  return ( 
    <View className="flex-1">
      <Header
        isAuthenticated
        userInitials={userInitials}
        onAvatarPress={onAvatarPress}
      />

      <ScrollView className="flex-1 px-3">
        <View className="px-4 py-4">
          <ServiceDisplay
            services={mockServices}
            selectedService={selectedService}
            onPress={(service) =>
              onSelectService(
                selectedService?.id === service.id ? null : service
              )
            }
          />
        </View>
        <View  className="h-px bg-brand-border my-3" />
        <View
          className="px-4 py-3"
        >
          <CalendarToggle
            mode={calendarMode}
            onChange={setCalendarMode}
          />
        </View>
        <View  className="h-px bg-brand-border mb-3" />
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
        <View  className="h-px bg-brand-border my-4" />
        <View>
          {selectedService ? (
            <ScheduleDisplay
              day={selectedDate}
              startHour={MOCK_SCHEDULE.startHour}
              endHour={MOCK_SCHEDULE.endHour}
              slotLength={MOCK_SCHEDULE.slotLength}
              appointments={appointments}
              appointmentDuration={appointmentDuration}
              selectedStartTime={selectedStartTime}
              onSlotPress={(slot) => setSelectedStartTime(slot.start)}
            />
          ) : (
              <Text className="py-6 text-center font-roboto-slab-medium text-brand-tertiary">
                Select a service to view available times.
              </Text>
          )}
        </View>
      </ScrollView>
      <BottomNav
        active="Appointments"
        onChange={(tab) => onNavigate(tab.toLowerCase() as AppView)}
      />
    </View>
  )
}

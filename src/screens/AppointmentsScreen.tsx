import { useState } from "react";
import { View, ScrollView } from "react-native";
import { subMonths, addMonths } from "date-fns";
import { WeekStrip } from "../components/appointments/DateSelect/WeekStrip";
import { MonthDisplay } from "../components/appointments/DateSelect/MonthDisplay";
import { MonthHeader } from "../components/appointments/DateSelect/MonthHeader";
import { ScheduleDisplay } from "../components/appointments/Schedule/ScheduleDisplay";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";

export interface AppointmentsScreenProps {
  userInitials?: string;
  onAvatarPress?: () => void;
  onNavigate: (screen: AppView) => void;
}

const MOCK_SCHEDULE = {
  startHour: 9,
  endHour: 17,
  slotLength: 30,
}

export function AppointmentsScreen({ userInitials = "?", onAvatarPress, onNavigate }: AppointmentsScreenProps ) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  return ( 
    <View>
      <Header
        isAuthenticated
        userInitials={userInitials}
        onAvatarPress={onAvatarPress}
      />

      <ScrollView>
        <View>
          <WeekStrip
            selectedDate={selectedDate}
            weekStart={weekStart}
            onSelectDate={setSelectedDate}
          />
        </View>

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
        </View>
        <View>
          <MonthDisplay
            month={displayMonth}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </View>

        <View>
          <ScheduleDisplay
            day={selectedDate}
            startHour={MOCK_SCHEDULE.startHour}
            endHour={MOCK_SCHEDULE.endHour}
            slotLength={MOCK_SCHEDULE.slotLength}
            selectedStartTime={selectedStartTime}
            onSlotPress={(slot) => setSelectedStartTime(slot.start)}
          />
        </View>
      </ScrollView>
      <BottomNav
        active="Appointments"
        onChange={(tab) => onNavigate(tab.toLowerCase() as AppView)}
      />
    </View>
  )
}

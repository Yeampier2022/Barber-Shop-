import { useState } from "react";
import { WeekStrip } from "../components/appointments/DateSelect/WeekStrip";

// Barber Info Header

// Service Selector

// Date Selector
const [selectedDate, setSelectedDate] = useState(new Date());
const[weekStart, setWeekStart] = useState(new Date());
<WeekStrip
  selectedDate={selectedDate}
  weekStart={weekStart}
  onSelectDate={setSelectedDate}
/>

// Time Selector

// Book Button
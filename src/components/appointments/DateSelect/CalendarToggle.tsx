import { View } from "react-native";
import { Button } from "../../Button";

type CalendarToggleProps = {
  mode: "week" | "month";
  onChange: (mode: "week" | "month") => void;
};

export function CalendarToggle({
  mode,
  onChange,
}: CalendarToggleProps) {

  return (
    <View className="flex-row justify-center items-center gap-4">
      <Button
        variant={mode === "week" ? "solid" : "soft"}
        size="sm"
        onPress={() => onChange("week")}
      >
        Week
      </Button>

      <Button
        variant={mode === "month" ? "solid" : "soft"}
        size="sm"
        onPress={() => onChange("month")}
      >
        Month
      </Button>
    </View>
  );
}
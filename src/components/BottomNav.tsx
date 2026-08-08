import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { cn } from "../utils/cn";

export type BottomNavTab = "Home" | "Appointments" | "Services" | "Profile";

export interface BottomNavProps {
  active: BottomNavTab;
  onChange?: (tab: BottomNavTab) => void;
  className?: string;
}

const TABS: BottomNavTab[] = ["Home", "Appointments", "Services", "Profile"];

const TAB_ICONS: Record<BottomNavTab, keyof typeof MaterialIcons.glyphMap> = {
  Home: "home",
  Appointments: "event",
  Services: "content-cut",
  Profile: "person",
};

export function BottomNav({ active, onChange, className }: BottomNavProps) {
  return (
    <View
      className={cn(
        "flex-row items-center justify-around border-t border-brand-border bg-white px-2 pb-6 pt-2",
        className
      )}
    >
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <Pressable
            key={tab}
            accessibilityRole="button"
            onPress={() => onChange?.(tab)}
            className="flex-1 items-center justify-center py-1"
            style={{ gap: 4 }}
          >
            <MaterialIcons
              name={TAB_ICONS[tab]}
              size={22}
              color={isActive ? colors.primary : colors.tertiary}
            />
            <Text
              className={cn(
                "font-roboto-slab text-xs",
                isActive
                  ? "font-roboto-slab-bold text-brand-primary"
                  : "text-brand-tertiary"
              )}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

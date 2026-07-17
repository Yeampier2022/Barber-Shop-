import { Pressable, Text, View } from "react-native";
import { cn } from "../utils/cn";

export type BottomNavTab = "Home" | "Appointments" | "Services" | "Profile";

export interface BottomNavProps {
  active: BottomNavTab;
  onChange?: (tab: BottomNavTab) => void;
  className?: string;
}

const TABS: BottomNavTab[] = ["Home", "Appointments", "Services", "Profile"];

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
            <View
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isActive ? "bg-brand-primary" : "bg-transparent"
              )}
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

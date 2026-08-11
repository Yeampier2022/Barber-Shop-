import { Pressable, PressableProps, Text, View, ViewStyle } from "react-native";
import { cn } from "../utils/cn";
import { ButtonColor } from "./Button";

export interface AvatarProps extends Omit<PressableProps, "children" | "style"> {
  initials: string;
  color?: ButtonColor;
  /** Diameter in px. */
  size?: number;
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
}

const COLOR_CLASSES: Record<ButtonColor, string> = {
  primary: "bg-brand-primary",
  secondary: "bg-brand-secondary",
  tertiary: "bg-brand-tertiary",
};

export function Avatar({
  initials,
  color = "primary",
  size = 40,
  className,
  textClassName,
  style,
  ...pressableProps
}: AvatarProps) {
  return (
    <Pressable
      accessibilityRole={pressableProps.onPress ? "button" : undefined}
      className={cn("items-center justify-center rounded-full", COLOR_CLASSES[color], className)}
      style={[{ width: size, height: size, borderCurve: "continuous" }, style]}
      {...pressableProps}
    >
      <Text
        className={cn("font-roboto-slab-bold text-white", textClassName)}
        style={{ fontSize: size * 0.4 }}
      >
        {initials.trim().slice(0, 2).toUpperCase()}
      </Text>
    </Pressable>
  );
}

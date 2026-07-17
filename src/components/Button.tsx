import { ActivityIndicator, Pressable, PressableProps, StyleProp, Text, ViewStyle } from "react-native";
import { colors } from "../theme/colors";
import { cn } from "../utils/cn";

export type ButtonColor = "primary" | "secondary" | "tertiary";
export type ButtonVariant = "solid" | "soft" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  children: React.ReactNode;
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  /** Extra classes appended to the pressable container, letting you override anything above. */
  className?: string;
  /** Extra classes appended to the label Text. */
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
}

const SOLID_CLASSES: Record<ButtonColor, string> = {
  primary: "bg-brand-primary",
  secondary: "bg-brand-secondary",
  tertiary: "bg-brand-tertiary",
};

const SOLID_TEXT_CLASSES: Record<ButtonColor, string> = {
  primary: "text-white",
  secondary: "text-white",
  tertiary: "text-white",
};

const SOFT_CLASSES: Record<ButtonColor, string> = {
  primary: "bg-brand-neutral",
  secondary: "bg-brand-cream",
  tertiary: "bg-brand-border",
};

const SOFT_TEXT_CLASSES: Record<ButtonColor, string> = {
  primary: "text-brand-primary",
  secondary: "text-brand-secondary",
  tertiary: "text-brand-tertiary",
};

const OUTLINE_TEXT_CLASSES: Record<ButtonColor, string> = {
  primary: "border-brand-primary text-brand-primary",
  secondary: "border-brand-secondary text-brand-secondary",
  tertiary: "border-brand-tertiary text-brand-tertiary",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-5 py-2.5",
  lg: "px-7 py-3.5",
};

const TEXT_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  children,
  color = "primary",
  variant = "solid",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  className,
  textClassName,
  style,
  ...pressableProps
}: ButtonProps) {
  const containerClasses = cn(
    "flex-row items-center justify-center rounded-full",
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    (disabled || loading) && "opacity-50",
    variant === "solid" && SOLID_CLASSES[color],
    variant === "soft" && SOFT_CLASSES[color],
    variant === "outline" && cn("border bg-transparent", OUTLINE_TEXT_CLASSES[color]),
    className
  );

  const labelClasses = cn(
    "font-roboto-slab-bold text-center",
    TEXT_SIZE_CLASSES[size],
    variant === "solid" && SOLID_TEXT_CLASSES[color],
    variant === "soft" && SOFT_TEXT_CLASSES[color],
    variant === "outline" && OUTLINE_TEXT_CLASSES[color],
    textClassName
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      className={containerClasses}
      style={[{ borderCurve: "continuous" }, style]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={variant === "solid" ? "#FFFFFF" : colors[color]} />
      ) : typeof children === "string" ? (
        <Text className={labelClasses}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

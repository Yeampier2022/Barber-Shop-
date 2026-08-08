import { Text, TextInput, TextInputProps, View } from "react-native";
import { cn } from "../utils/cn";

export type InputVariant = "light" | "dark";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends TextInputProps {
  label?: string;
  variant?: InputVariant;
  size?: InputSize;
  error?: string;
  /** Classes for the wrapping View (label + field + error). */
  containerClassName?: string;
  /** Classes for the label Text. */
  labelClassName?: string;
  /** Classes appended to the TextInput, letting you override anything above. */
  className?: string;
}

const VARIANT_CLASSES: Record<InputVariant, string> = {
  light: "bg-brand-neutral text-brand-primary",
  dark: "bg-brand-primary text-white",
};

const VARIANT_PLACEHOLDER_COLOR: Record<InputVariant, string> = {
  light: "#9CA3AF",
  dark: "#DCDCDC",
};

const VARIANT_LABEL_CLASSES: Record<InputVariant, string> = {
  light: "text-brand-primary",
  dark: "text-white",
};

const SIZE_CLASSES: Record<InputSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-5 py-4 text-lg",
};

export function Input({
  label,
  variant = "light",
  size = "md",
  error,
  containerClassName,
  labelClassName,
  className,
  style,
  placeholderTextColor,
  ...textInputProps
}: InputProps) {
  return (
    <View className={containerClassName}>
      {label ? (
        <Text
          className={cn(
            "mb-1 font-roboto-slab-bold text-sm",
            VARIANT_LABEL_CLASSES[variant],
            labelClassName
          )}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        className={cn(
          "rounded-lg font-roboto-slab",
          SIZE_CLASSES[size],
          VARIANT_CLASSES[variant],
          error && "border border-red-500",
          className
        )}
        placeholderTextColor={placeholderTextColor ?? VARIANT_PLACEHOLDER_COLOR[variant]}
        style={[{ borderCurve: "continuous" }, style]}
        {...textInputProps}
      />
      {error ? <Text className="mt-1 text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}

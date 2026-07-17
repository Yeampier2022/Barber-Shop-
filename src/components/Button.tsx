import type { ReactNode } from "react";
import { Pressable, Text, StyleSheet } from "react-native";

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
}

export function BlueButton({ children, disabled=false }: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonBlue,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  buttonBlue: {
    backgroundColor: '#124170',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#91adc8',
  },
  buttonDisabled: {
    backgroundColor: '#F3F2EC',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});
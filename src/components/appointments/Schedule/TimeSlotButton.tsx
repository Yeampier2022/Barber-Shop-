import {
  Button,
  type ButtonColor,
  type ButtonVariant,
} from "../../Button";
import { View, Text } from "react-native";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { formatTime } from "../../../utils/scheduleUtils";
import type { SlotState, TimeSlot } from "../../../types/schedule";

type TimeSlotButtonProps = {
  slot: TimeSlot;
  state: SlotState;
  onPress: () => void;
};

const TIME_SLOT_STYLES: Record<SlotState, {
  variant: ButtonVariant;
  color: ButtonColor;
  textColor: string;
  disabled: boolean;
  className?: string;
}> = {
  available: { 
    variant: "soft",
    color: "tertiary",
    textColor: colors.primary,
    disabled: false,
    className: "flex-1 mx-1 rounded-xl py-2"
  },
  unavailable: { 
    variant: "soft",
    color: "primary",
    textColor: colors.tertiary,
    disabled: true
   },
  selected: { 
    variant: "solid",
    color: "primary",
    textColor: colors.cream,
    disabled: false
   },
};

export function TimeSlotButton({
  slot,
  state,
  onPress
}: TimeSlotButtonProps) { 

  const style = TIME_SLOT_STYLES[state];

  return (
    <Button
      variant={style.variant}
      color={style.color}
      size="sm"
      disabled={style.disabled}
      className={style.className}
      onPress={onPress}
    >
      <Text
        style={{
          color: style.textColor,
          fontFamily: fonts.medium,
          fontSize: 12,
        }}
      >
        {formatTime(slot.start)}
      </Text>
    </Button>
  );
}
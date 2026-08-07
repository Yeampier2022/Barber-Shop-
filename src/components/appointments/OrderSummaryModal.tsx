import { Modal, Text, View } from "react-native";
import { addMinutes } from "date-fns";
import type { Service } from "../../types/service";
import type { Barber } from "../../types/barber";
import { Button } from "../Button";
import { formatFullDate } from "../../utils/dateUtils";
import { formatTime } from "../../utils/scheduleUtils";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

type OrderSummaryModalProps = {
  visible: boolean;
  service: Service;
  barber: Barber;
  date: Date;
  startTime: Date;
  duration: number;
  isSubmitting: boolean;
  submitError: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <View className="flex-row justify-between py-2">
      <Text
        style={{
          color: colors.tertiary,
          fontFamily: fonts.regular,
          fontSize: 14,
        }}
      >
        {label}
      </Text>

      <Text
        className="ml-4 flex-1 text-right"
        style={{
          color: colors.primary,
          fontFamily: fonts.medium,
          fontSize: 14,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export function OrderSummaryModal({
  visible,
  service,
  barber,
  date,
  startTime,
  duration,
  isSubmitting,
  submitError,
  onClose,
  onConfirm,
}: OrderSummaryModalProps) {
  const endTime = addMinutes(startTime, duration);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="w-full rounded-xl bg-white p-4">
          <Text
            className="mb-3"
            style={{
              color: colors.primary,
              fontFamily: fonts.bold,
              fontSize: 22,
            }}
          >
            Review Order
          </Text>

          <View className="rounded-xl border border-brand-border bg-brand-neutral p-4">
            <SummaryRow label="Service" value={service.name} />
            <SummaryRow label="Barber" value={barber.name} />
            <SummaryRow label="Date" value={formatFullDate(date)} />
            <SummaryRow
              label="Time"
              value={`${formatTime(startTime)} - ${formatTime(endTime)}`}
            />
            <SummaryRow label="Duration" value={`${duration} minutes`} />

            <View className="my-2 h-px bg-brand-border" />

            <SummaryRow label="Total" value={`$${service.price}`} />
          </View>

          {submitError ? (
            <Text
              className="mt-3 text-center"
              style={{
                color: colors.secondary,
                fontFamily: fonts.medium,
                fontSize: 14,
              }}
            >
              {submitError}
            </Text>
          ) : null}

          <View className="mt-6" style={{ gap: 12 }}>
            <Button
              size="md"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
              onPress={onConfirm}
            >
              {isSubmitting ? "Booking..." : "Confirm Appointment"}
            </Button>
            <Button
              size="md"
              variant="outline"
              fullWidth
              disabled={isSubmitting}
              onPress={onClose}
            >
              Make Changes
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

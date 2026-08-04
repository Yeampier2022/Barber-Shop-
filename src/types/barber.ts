import type { ImageSourcePropType } from "react-native";

export type Barber = {
  id: string;
  name: string;
  phone: string;
  image: ImageSourcePropType;
};

export type BarberState =
  | "default"
  | "selected";

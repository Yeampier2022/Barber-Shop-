// Keep in sync with the `brand` palette in tailwind.config.js.
export const colors = {
  primary: "#124170",
  secondary: "#647FBC",
  tertiary: "#91ADC8",
  neutral: "#F4F4F4",
  cream: "#F3F2EC",
  border: "#DCDCDC",
} as const;

export type BrandColor = keyof typeof colors;

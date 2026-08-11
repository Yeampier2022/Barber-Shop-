/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#124170",
          secondary: "#647FBC",
          tertiary: "#91ADC8",
          neutral: "#F4F4F4",
          cream: "#F3F2EC",
          border: "#DCDCDC",
        },
      },
      fontFamily: {
        "roboto-slab": ["RobotoSlab_400Regular"],
        "roboto-slab-medium": ["RobotoSlab_500Medium"],
        "roboto-slab-bold": ["RobotoSlab_700Bold"],
      },
    },
  },
  plugins: [],
}
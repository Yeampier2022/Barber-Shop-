import type { Service } from "../types/service";

export const mockServices: Service[] = [
  {
    id: "classic-haircut",
    name: "Classic Haircut",
    description: "A tailored haircut finished with professional styling.",
    duration: 30,
    price: 25,
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    description: "Beard shaping and detailing for a clean, polished look.",
    duration: 20,
    price: 15,
  },
  {
    id: "haircut-and-beard",
    name: "Haircut & Beard",
    description: "A complete haircut and beard-trim package.",
    duration: 50,
    price: 38,
  },
];

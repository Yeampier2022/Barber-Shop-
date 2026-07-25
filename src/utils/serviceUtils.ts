import type { Service, ServiceState } from "../types/service";

const APPOINTMENT_INTERVAL = 15; // minutes
export function calculateDuration( //Round service duration to the nearest appointment interval for scheduling
  services: Service[]
): number {
  const totalDuration = services.reduce(
    (total, service) => total + service.duration,
    0
  );

  return (
    Math.ceil(totalDuration / APPOINTMENT_INTERVAL) *
    APPOINTMENT_INTERVAL
  );
}

export function toggleService(
  selectedServices: Service[],
  service: Service
): Service[] {
  if (selectedServices.some((selectedService) => selectedService.id === service.id)) {
    return selectedServices.filter((selectedService) => selectedService.id !== service.id);
  } else {
    return [...selectedServices, service];
  }
}

export function getServiceState(
  service: Service,
  selectedServices: Service | null
): ServiceState {
  return selectedServices?.id === service.id
    ? "selected"
    : "default";
}
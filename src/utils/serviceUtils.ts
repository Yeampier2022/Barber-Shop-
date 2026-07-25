import type { Service, ServiceState } from "../types/service";

export function calculateDuration(services: Service[]): number {
  return services.reduce(
    (total, service) => total + service.duration,
    0
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
  selectedServices: Service[]
): ServiceState {
  const isSelected = selectedServices.some(
    (selectedService) => selectedService.id === service.id);
  return isSelected ? "selected" : "default";
}
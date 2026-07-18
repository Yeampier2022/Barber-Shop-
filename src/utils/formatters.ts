export function getInitials(name?: string | null): string {
  const trimmed = name?.trim();
  if (!trimmed) {
    return "?";
  }
  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

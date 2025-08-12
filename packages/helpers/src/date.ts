export function formatDatetime(dateString?: string | null): string | undefined {
  if (!dateString) return undefined;
  return `${dateString}T00:00:00Z`;
}

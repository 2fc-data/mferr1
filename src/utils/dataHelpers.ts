export const extractYearFromDesfecho = (dateStr?: string): string | null => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length < 3) return null;
  const year = parts[2];
  return /^\d{4}$/.test(year) ? year : null;
};

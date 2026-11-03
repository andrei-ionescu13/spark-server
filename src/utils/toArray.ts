export const toArray = (value: unknown) => {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
};

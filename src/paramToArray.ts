export const paramToArray = (value: unknown) =>
  typeof value === 'string' ? value.split(',') : value;

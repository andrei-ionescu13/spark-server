import { ValidationError } from './errors';

export const validate = (schema, values) => {
  const { error } = schema.validate(values);

  if (error) {
    throw new ValidationError(error.message);
  }
};
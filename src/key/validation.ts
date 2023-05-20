import Joi from 'joi';
import { validate } from '../validate';

export const keyValidation = {
  createKey: (values) => {
    const schema = Joi.object({
      productId: Joi.string().required(),
      keyValue: Joi.string().min(12).max(64).required(),
    });

    validate(schema, values);
  },
  updateKeyStatus: (values) => {
    const schema = Joi.object({
      status: Joi.string().valid('reported', 'revealed').required(),
    });

    validate(schema, values);
  },
};

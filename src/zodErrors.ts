import { ZodError } from 'zod';
import {
  DomainValidationError,
  MappingValidationError,
  RequestValidationError,
} from './modules/blog/article/status';

export const zodDomainValidationError = (error: ZodError): DomainValidationError => {
  return new DomainValidationError(error.issues[0].message);
};

export const zodMappingValidationError = (error: ZodError): MappingValidationError => {
  return new MappingValidationError(error.issues[0].message);
};

export const zodRequestValidationError = (error: ZodError): RequestValidationError => {
  return new RequestValidationError(error.issues[0].message);
};

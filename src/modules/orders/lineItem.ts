import * as z from 'zod';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';
import { DomainValidationError } from '../blog/article/status';

interface LineItemProps {
  _id: string;
  product: string;
  finalLinePrice: number;
  finalPrice: number;
  originalPrice: number;
  originalLinePrice: number;
  quantity: number;
}

export class LineItem {
  constructor(private props: LineItemProps) {}

  static create(props: LineItemProps): Result<LineItem, DomainValidationError> {
    const schema = z.object({
      _id: z.uuidv7(),
      product: z.uuidv7(),
      finalLinePrice: z.number().positive(),
      finalPrice: z.number().positive(),
      originalPrice: z.number().positive(),
      originalLinePrice: z.number().positive(),
      quantity: z.number().positive(),
    });

    const validation = schema.safeParse(props);
    if (validation.error) return Result.fail(zodDomainValidationError(validation.error));

    return Result.ok(new LineItem(props));
  }
}

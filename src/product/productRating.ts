import z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { ValueObject } from '../blog/article/valueObject';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';

interface ProductRatingProps {
  average: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export class ProductRating extends ValueObject<ProductRatingProps> {
  private constructor(props: ProductRatingProps) {
    super(props);
  }

  static create(props: ProductRatingProps): Result<ProductRating, DomainValidationError> {
    const schema = z.object({
      average: z.number().positive(),
      distribution: z.object({
        1: z.number().positive(),
        2: z.number().positive(),
        3: z.number().positive(),
        4: z.number().positive(),
        5: z.number().positive(),
      }),
    });
    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ProductRating(props));
  }

  get average() {
    return this.props.average;
  }

  get distribution() {
    return this.props.distribution;
  }
}

import z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../results';
import { zodDomainValidationError } from '../../../zodErrors';

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
      average: z.number(),
      distribution: z.object({
        1: z.number(),
        2: z.number(),
        3: z.number(),
        4: z.number(),
        5: z.number(),
      }),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new ProductRating(props));
  }

  static createDefault(): ProductRating {
    return new ProductRating({
      average: 0,
      distribution: {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
      },
    });
  }

  static reconstitute(props: ProductRatingProps): ProductRating {
    return new ProductRating(props);
  }

  get average() {
    return this.props.average;
  }

  get distribution() {
    return this.props.distribution;
  }
}

import z from 'zod';
import { DomainValidationError } from '../../blog/article/domain/status';
import { ValueObject } from '../../../valueObject';
import { Result } from '../../../result';
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

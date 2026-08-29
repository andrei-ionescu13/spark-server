import z from 'zod';
import { DomainValidationError } from '../blog/article/status';
import { Result } from '../../Result';
import { zodDomainValidationError } from '../../zodErrors';
import { KeyAvailability } from './keyAvailability';
import { KeyStatus } from './keyStatus';
import { KeyValue } from './keyValue';

interface KeyProps {
  product: string;
  createdAt: Date;
  value: KeyValue;
  availability: KeyAvailability;
  status: KeyStatus;
  _id: string;
}

interface KeyCreateProps extends Omit<KeyProps, 'createdAt'> {
  createdAt?: Date | null;
}

export class Key {
  constructor(private props: KeyProps) {}

  public static create(props: KeyCreateProps): Result<Key, DomainValidationError> {
    const schema = z.object({
      product: z.uuidv7(),
      createdAt: z.date(),
      _id: z.uuidv7(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Key({
        ...props,
        createdAt: props?.createdAt || null,
      }),
    );
  }

  public changeStatus(status: KeyStatus) {
    if (this.status.value === 'secret') {
      return Result.fail(new DomainValidationError("Can't change the status of a secret key"));
    }

    this.props.status = status;
    return Result.ok();
  }

  get product() {
    return this.props.product;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get value() {
    return this.props.value;
  }

  get availability() {
    return this.props.availability;
  }

  get status() {
    return this.props.status;
  }

  get _id() {
    return this.props._id;
  }
}

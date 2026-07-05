import mongoose from 'mongoose';
import * as z from 'zod';
import { DomainValidationError } from './blog/article/status';
import { ValueObject } from './blog/article/valueObject';
import { Result } from './Result';
import { zodDomainValidationError } from './zodErrors';
const { Schema } = mongoose;

interface MetaProps {
  title: string;
  description: string;
  keywords: string[];
}

export class Meta extends ValueObject<MetaProps> {
  constructor(props: MetaProps) {
    super(props);
  }

  static create(props: MetaProps): Result<Meta, DomainValidationError> {
    const schema = z.object({
      title: z.string().min(8).max(120),
      description: z.string().min(120).max(1024),
      keywords: z.array(z.string()).min(3),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(new Meta(props));
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get keywords() {
    return this.props.keywords;
  }
}

export interface MetaDoc {
  title: string;
  description: string;
  keywords: string[];
}

export const MetaSchema = new Schema<MetaDoc>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keywords: { type: [String], required: true },
});

export const MetaModel = mongoose.model<MetaDoc>('Meta', MetaSchema);

import z from 'zod';
import { DomainValidationError } from '../../blog/article/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { NamespaceTranslation } from './namespaceTransation';
import { v7 as uuid7 } from 'uuid';
import { Result } from '../../../result';

interface NamespaceProps {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  translations: NamespaceTranslation[];
}

interface NamespacePropsCreate
  extends Omit<NamespaceProps, 'createdAt' | 'updatedAt' | 'translations' | '_id'> {
  translations?: NamespaceTranslation[];
}

export class Namespace {
  constructor(private props: NamespaceProps) {}

  public static create(props: NamespacePropsCreate): Result<Namespace, DomainValidationError> {
    const schema = z.object({
      name: z.string(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Namespace({
        ...props,
        createdAt: new Date(),
        updatedAt: null,
        translations: props.translations || [],
        _id: uuid7(),
      }),
    );
  }

  public static reconstitute(props: NamespaceProps) {
    return new Namespace(props);
  }

  public addTranslation(translation: NamespaceTranslation): Result<void, DomainValidationError> {
    const exists = this.translations.some((t) => t.key === translation.key);

    if (exists) {
      return Result.fail(
        new DomainValidationError(
          `Translation with key "${translation.key}" already exists in this namespace`,
        ),
      );
    }

    this.translations.push(translation);
    return Result.ok(undefined);
  }

  public removeTranslation(translationKey: string): Result<void, DomainValidationError> {
    const index = this.translations.findIndex((t) => t.key === translationKey);

    if (index === -1) {
      return Result.fail(
        new DomainValidationError(
          `Translation with key "${translationKey}" doesn't exist in this namespace`,
        ),
      );
    }

    this.translations.splice(index, 1);
    return Result.ok(undefined);
  }

  public updateTranslation(
    key: string,
    translation: NamespaceTranslation,
  ): Result<void, DomainValidationError> {
    const index = this.translations.findIndex((t) => t.key === key);

    if (index === -1) {
      return Result.fail(
        new DomainValidationError(`Translation with key "${key}" doesn't exist in this namespace`),
      );
    }

    this.translations[index] = translation;
    return Result.ok(undefined);
  }

  public updateName(name: string) {
    this.props.name = name;
  }

  get _id() {
    return this.props._id;
  }

  get name() {
    return this.props.name;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get translations() {
    return this.props.translations;
  }
}

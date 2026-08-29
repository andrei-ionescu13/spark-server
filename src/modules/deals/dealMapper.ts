import { AssetDto, AssetMapper } from '../blog/article/assetMapper';
import { DomainValidationError } from '../blog/article/status';
import { MetaDto, MetaMapper } from '../../metaMapper';
import { Result } from '../../Result';
import { Deal } from './deal';
import { DealDescription } from './dealDescription';
import { DealTitle } from './dealTitle';
import { DealDoc } from './model';

export interface DealDto {
  _id: string;
  cover: AssetDto;
  title: string;
  description: string;
  slug: string;
  startDate: Date;
  endDate: Date | null;
  meta: MetaDto;
  createdAt: Date;
  updatedAt: Date | null;
  products: string[];
}

export class DealMapper {
  static toDomain(doc: DealDoc): Result<Deal, DomainValidationError> {
    const titleOrError = DealTitle.create(doc.title);
    const descriptionOrError = DealDescription.create(doc.description);

    const result = Result.combine([titleOrError, descriptionOrError]);
    if (result.isErr()) return Result.fail(new DomainValidationError(result.error.message));

    const title = titleOrError.value;
    const description = descriptionOrError.value;

    const dealOrError = Deal.create({
      _id: doc._id,
      cover: doc.cover,
      title,
      description,
      slug: doc.slug,
      startDate: doc.startDate,
      endDate: doc.endDate,
      meta: doc.meta,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      products: doc.products,
    });

    if (dealOrError.isErr())
      return Result.fail(new DomainValidationError(dealOrError.error.message));

    const deal = dealOrError.value;
    return Result.ok(deal);
  }

  static toDto(doc: DealDoc): DealDto {
    return {
      _id: doc._id,
      cover: AssetMapper.toDto(doc.cover),
      title: doc.title,
      description: doc.description,
      slug: doc.slug,
      startDate: doc.startDate,
      endDate: doc.endDate,
      meta: MetaMapper.toDto(doc.meta),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      products: doc.products,
    };
  }

  static toDtoList(docs: DealDoc[]): DealDto[] {
    return docs.map((doc) => DealMapper.toDto(doc));
  }

  static toPersistence(doc: Deal): DealDoc {
    return {
      cover: AssetMapper.toPersistance(doc.cover),
      title: doc.title.value,
      description: doc.title.value,
      slug: doc.slug,
      startDate: doc.startDate,
      endDate: doc.endDate,
      meta: doc.meta,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      products: doc.products,
      _id: doc._id,
    };
  }
}

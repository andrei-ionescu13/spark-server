import { AssetDto, AssetMapper } from '../../assetMapper';
import { DomainValidationError } from '../blog/article/domain/status';
import { MetaDto, MetaMapper } from '../../metaMapper';
import { Deal } from './domain/deal';
import { DealDescription } from './domain/dealDescription';
import { DealTitle } from './domain/dealTitle';
import { DealDoc } from './model';
import { Asset } from '../../Asset';

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
  static toDomain(doc: DealDoc): Deal {
    const title = DealTitle.reconstitute(doc.title);
    const description = DealDescription.reconstitute(doc.description);

    const deal = Deal.reconstitute({
      _id: doc._id,
      cover: AssetMapper.toDomain(doc.cover),
      title,
      description,
      slug: doc.slug,
      startDate: doc.startDate,
      endDate: doc.endDate,
      meta: MetaMapper.toDomain(doc.meta),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      products: doc.products,
    });

    return deal;
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
      meta: MetaMapper.toPersistance(doc.meta),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      products: doc.products,
      _id: doc._id,
    };
  }
}

import { AssetDto, AssetMapper, AssetPersistance } from '../../assetMapper';
import { MetaDto, MetaPersistance } from '../../metaMapper';
import { Result } from '../../result';
import { ProductDoc } from './model';
import { Product } from './domain/product';
import { ProductLink } from './domain/productLink';
import { ProductMarkdown } from './domain/productMarkdown';
import { ProductPrice } from './domain/productPrice';
import { ProductRating } from './domain/productRating';
import { ProductRequirements } from './domain/productRequirements';
import { ProductStatus } from './domain/productStatus';
import { ProductTitle } from './domain/productTitle';
import { Meta } from '../../Meta';
import { platform } from 'os';

export interface ProductDto {
  _id: string;
  cover: AssetDto;
  allImages: AssetDto[];
  images: AssetDto[];
  videos: string[];
  status: 'draft' | 'published' | 'archived';
  title: string;
  price: number;
  genres: string[];
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
  publisher: string;
  platform: string;
  developers: string[];
  features: string[];
  link: string | null;
  os: string[];
  markdown: string;
  meta: MetaDto;
  minimumRequirements: string;
  recommendedRequirements: string;
  slug: string;
  keys: string[];
  rating: {
    average: number;
    distribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  reviews: string[];
  discount: string | null;
}

interface ProductPersistance {
  _id: string;
  cover: AssetPersistance;
  allImages: AssetPersistance[];
  images: AssetPersistance[];
  videos: string[];
  status: 'draft' | 'published' | 'archived';
  title: string;
  price: number;
  genres: string[];
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
  publisher: string;
  platform: string;
  developers: string[];
  features: string[];
  link: string | null;
  os: string;
  markdown: string;
  meta: MetaPersistance;
  minimumRequirements: string;
  recommendedRequirements: string;
  slug: string;
  keys: string[];
  rating: {
    average: number;
    distribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  reviews: string[];
  discount: string | null;
}

export class ProductMapper {
  public static toDomain(entity: ProductDoc): Product {
    const meta = Meta.reconstitute(entity.meta);
    const status = ProductStatus.reconstitute(entity.status);
    const title = ProductTitle.reconstitute(entity.title);
    const price = ProductPrice.reconstitute(entity.price);
    const markdown = ProductMarkdown.reconstitute(entity.markdown);
    const minimumRequirements = ProductRequirements.reconstitute(entity.minimumRequirements);
    const recommendedRequirements = ProductRequirements.reconstitute(
      entity.recommendedRequirements,
    );
    const rating = ProductRating.reconstitute(entity.rating);

    let link: ProductLink | null = null;
    if (entity.link) {
      link = ProductLink.reconstitute(entity.link);
    }

    const cover = AssetMapper.toDomain(entity.cover);
    const allImages = AssetMapper.toDomainList(entity.allImages);
    const images = AssetMapper.toDomainList(entity.images);

    const product = Product.reconstitute({
      _id: entity._id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      cover,
      allImages: allImages,
      images: images,
      videos: entity.videos,
      genres: entity.genres,
      releaseDate: entity.releaseDate,
      publisher: entity.publisher,
      platform: entity.platform,
      developers: entity.developers,
      features: entity.features,
      os: entity.os,
      slug: entity.slug,
      keys: entity.keys,
      reviews: entity.reviews,
      discount: entity.discount,
      status,
      title,
      price,
      link,
      markdown,
      minimumRequirements,
      recommendedRequirements,
      rating,
      meta,
    });

    return product;
  }

  static toDomainList(entities: ProductDoc[]): Product[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  static toDto(entity: ProductDoc): ProductDto {
    return {
      _id: entity._id,
      cover: AssetMapper.toDto(entity.cover),
      allImages: AssetMapper.toDtoList(entity.allImages),
      images: AssetMapper.toDtoList(entity.images),
      videos: entity.videos,
      genres: entity.genres,
      releaseDate: entity.releaseDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      publisher: entity.publisher,
      platform: entity.platform,
      developers: entity.developers,
      features: entity.features,
      os: entity.os,
      meta: entity.meta,
      slug: entity.slug,
      keys: entity.keys,
      reviews: entity.reviews,
      discount: entity.discount,
      status: entity.status,
      title: entity.title,
      price: entity.price,
      link: entity.link,
      markdown: entity.markdown,
      minimumRequirements: entity.minimumRequirements,
      recommendedRequirements: entity.recommendedRequirements,
      rating: entity.rating,
    };
  }

  static toDtoList(entities: ProductDoc[]): ProductDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Product): ProductDoc {
    return {
      _id: entity._id,
      cover: AssetMapper.toPersistance(entity.cover),
      allImages: AssetMapper.toPersistanceList(entity.allImages),
      images: AssetMapper.toPersistanceList(entity.images),
      videos: entity.videos,
      genres: entity.genres,
      releaseDate: entity.releaseDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      publisher: entity.publisher,
      platform: entity.platform,
      developers: entity.developers,
      features: entity.features,
      os: entity.os,
      meta: {
        description: entity.meta.description,
        keywords: entity.meta.keywords,
        title: entity.meta.title,
      },
      slug: entity.slug,
      keys: entity.keys,
      reviews: entity.reviews,
      discount: entity.discount,
      status: entity.status.value,
      title: entity.title.value,
      price: entity.price.value,
      link: entity.link?.value || null,
      markdown: entity.markdown.value,
      minimumRequirements: entity.minimumRequirements.value,
      recommendedRequirements: entity.recommendedRequirements.value,
      rating: {
        average: entity.rating.average,
        distribution: entity.rating.distribution,
      },
    };
  }

  static toPersistanceList(entities: Product[]): ProductDoc[] {
    return entities.map((entity) => this.toPersistance(entity));
  }
}

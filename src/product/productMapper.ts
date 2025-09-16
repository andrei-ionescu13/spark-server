import { AssetDto, AssetPersistance } from '../blog/article/assetMapper';
import { DomainValidationError } from '../blog/article/status';
import { Meta } from '../Meta';
import { MetaDto, MetaPersistance } from '../metaMapper';
import { Result } from '../Result';
import { ProductDoc } from './model';
import { PlatformDto, PlatformMapper } from './platform/platformMapper';
import { Product } from './product';
import { ProductLink } from './productLink';
import { ProductMarkdown } from './productMarkdown';
import { ProductPrice } from './productPrice';
import { ProductRating } from './productRating';
import { ProductRequirements } from './productRequirements';
import { ProductStatus } from './productStatus';
import { ProductTitle } from './productTitle';

export interface ProductDto {
  _id: string;
  cover: AssetDto;
  images: AssetDto[];
  selectedImages: AssetDto[];
  videos: string[];
  status: 'draft' | 'published' | 'archived';
  title: string;
  price: number;
  genres: string[];
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
  publisher: string;
  platform: PlatformDto;
  developers: string[];
  features: string[];
  link: string | null;
  os: string;
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
  discount: string;
}

interface ProductPersistance {
  _id: string;
  cover: AssetPersistance;
  images: AssetPersistance[];
  selectedImages: AssetPersistance[];
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
  discount: string;
}

export class ProductMapper {
  public static toDomain(entity: ProductDoc): Result<Product, DomainValidationError> {
    const metaOrError = Meta.create(entity.meta);
    const statusOrError = ProductStatus.create(entity.status);
    const titleOrError = ProductTitle.create(entity.title);
    const priceOrError = ProductPrice.create(entity.price);
    const linkOrError = ProductLink.create(entity.link);
    const markdownOrError = ProductMarkdown.create(entity.markdown);
    const minimumRequirementsOrError = ProductRequirements.create(entity.minimumRequirements);
    const recommendedRequirementsOrError = ProductRequirements.create(
      entity.recommendedRequirements,
    );
    const ratingOrError = ProductRating.create(entity.rating);

    const result = Result.combine([
      metaOrError,
      statusOrError,
      titleOrError,
      priceOrError,
      linkOrError,
      markdownOrError,
      minimumRequirementsOrError,
      recommendedRequirementsOrError,
      ratingOrError,
    ]);

    if (result.isErr()) {
      return Result.fail(new DomainValidationError(result.error.message));
    }

    const meta = metaOrError.value;
    const status = statusOrError.value;
    const title = titleOrError.value;
    const price = priceOrError.value;
    const link = linkOrError.value;
    const markdown = markdownOrError.value;
    const minimumRequirements = minimumRequirementsOrError.value;
    const recommendedRequirements = recommendedRequirementsOrError.value;
    const rating = ratingOrError.value;

    const productOrError = Product.create({
      _id: entity._id,
      cover: entity.cover,
      images: entity.images,
      selectedImages: entity.selectedImages,
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

    if (productOrError.isErr()) {
      return Result.fail(new DomainValidationError(productOrError.error.message));
    }

    const developer = productOrError.value;
    return Result.ok(developer);
  }

  static toDto(entity: any): ProductDto {
    return {
      _id: entity._id,
      cover: entity.cover,
      images: entity.images,
      selectedImages: entity.selectedImages,
      videos: entity.videos,
      genres: entity.genres,
      releaseDate: entity.releaseDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      publisher: entity.publisher,
      platform: PlatformMapper.toDto(entity.platform),
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

  static toDtoList(entities: any[]): ProductDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Product): ProductPersistance {
    return {
      _id: entity._id,
      cover: entity.cover,
      images: entity.images,
      selectedImages: entity.selectedImages,
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
      rating: entity.rating,
    };
  }
}

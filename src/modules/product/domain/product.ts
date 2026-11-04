import * as z from 'zod';
import { textUtils } from '../../../utils/textUtils';
import { DomainValidationError } from '../../blog/article/domain/status';
import { zodDomainValidationError } from '../../../zodErrors';
import { Meta } from '../../../meta';
import { v7 as uuid7 } from 'uuid';
import { Result } from '../../../results';
import { Asset } from '../../../asset';
import { ProductLink } from './productLink';
import { ProductMarkdown } from './productMarkdown';
import { ProductPrice } from './productPrice';
import { ProductRating } from './productRating';
import { ProductRequirements } from './productRequirements';
import { ProductStatus } from './productStatus';
import { ProductTitle } from './productTitle';

interface ProductProps {
  _id: string;
  cover: Asset;
  allImages: Asset[];
  images: Asset[];
  videos: string[];
  status: ProductStatus;
  title: ProductTitle;
  price: ProductPrice;
  genres: string[];
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
  publisher: string;
  platform: string;
  developers: string[];
  features: string[];
  link: ProductLink | null;
  os: string[];
  markdown: ProductMarkdown;
  meta: Meta;
  minimumRequirements: ProductRequirements;
  recommendedRequirements: ProductRequirements;
  slug: string;
  keys: string[];
  rating: ProductRating;
  reviews: string[];
  discount: string | null;
}

export interface UpdateProductDetailsProps {
  title: ProductTitle;
  price: ProductPrice;
  genres: string[];
  releaseDate: Date;
  publisher: string;
  platform: string;
  developers: string[];
  features: string[];
  link: ProductLink | null;
  os: string[];
  markdown: ProductMarkdown;
  minimumRequirements: ProductRequirements;
  recommendedRequirements: ProductRequirements;
  slug: string;
}

export interface UpdateProductMediaProps {
  cover?: Asset;
  allImages: Asset[];
  images: Asset[];
  videos: string[];
}

export interface ProductCreateProps
  extends Omit<
    ProductProps,
    | 'createdAt'
    | 'updatedAt'
    | 'slug'
    | '_id'
    | 'keys'
    | 'reviews'
    | 'discount'
    | 'rating'
    | 'status'
  > {
  slug?: string;
}

export class Product {
  constructor(private props: ProductProps) {}

  public static create(props: ProductCreateProps): Result<Product, DomainValidationError> {
    const schema = z.object({
      videos: z.array(z.url()).min(1),
      genres: z.array(z.uuidv7()).min(1),
      releaseDate: z.date(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      publisher: z.uuidv7(),
      platform: z.uuidv7(),
      developers: z.array(z.uuidv7()).min(1),
      features: z.array(z.uuidv7()).min(1),
      os: z.array(z.uuidv7()).min(1),
      slug: z.string().min(1).optional(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Product({
        ...props,
        createdAt: new Date(),
        updatedAt: null,
        slug: props.slug || textUtils.generateSlug(props.title.value),
        _id: uuid7(),
        keys: [],
        reviews: [],
        discount: null,
        rating: ProductRating.createDefault(),
        status: ProductStatus.createDefault(),
      }),
    );
  }

  public static reconstitute(props: ProductProps) {
    return new Product(props);
  }

  public addKey(keyId: string): Result<undefined, DomainValidationError> {
    if (this.props.keys.includes(keyId)) {
      return Result.fail(new DomainValidationError('Product already includes this key'));
    }

    this.props.keys.push(keyId);
    return Result.ok();
  }

  public removeKey(keyId: string): Result<undefined, DomainValidationError> {
    const index = this.props.keys.findIndex((_keyId) => _keyId === keyId);

    if (index === -1) {
      return Result.fail(new DomainValidationError('Product does not have this key'));
    }

    this.props.keys.splice(index, 1);
    return Result.ok();
  }

  public addDiscount(discountId: string): Result<undefined, DomainValidationError> {
    if (this.props.discount === discountId) {
      return Result.fail(
        new DomainValidationError(`Discount ${discountId} is already applied to product`),
      );
    }

    this.props.discount = discountId;
    return Result.ok();
  }

  public removeDiscount(): Result<undefined, DomainValidationError> {
    if (!this.props.discount) {
      return Result.fail(new DomainValidationError('Products does not have a discount'));
    }

    this.props.discount = null;
    return Result.ok();
  }

  public removeReview(reviewId: string): Result<undefined, DomainValidationError> {
    const index = this.props.reviews.indexOf(reviewId);

    if (index === -1) {
      return Result.fail(new DomainValidationError('Review not found'));
    }

    this.props.reviews.slice(index, 1);
    return Result.ok();
  }

  public updateDetails(props: UpdateProductDetailsProps): Result<void, DomainValidationError> {
    const schema = z.object({
      genres: z.array(z.uuidv7()).min(1),
      releaseDate: z.date(),
      publisher: z.uuidv7(),
      platform: z.uuidv7(),
      developers: z.array(z.uuidv7()).min(1),
      features: z.array(z.uuidv7()).min(1),
      os: z.array(z.uuidv7()).min(1),
      slug: z.string().min(1),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      console.log(result.error);
      return Result.fail(zodDomainValidationError(result.error));
    }

    this.props.title = props.title;
    this.props.price = props.price;
    this.props.genres = props.genres;
    this.props.releaseDate = props.releaseDate;
    this.props.publisher = props.publisher;
    this.props.platform = props.platform;
    this.props.developers = props.developers;
    this.props.features = props.features;
    this.props.link = props.link;
    this.props.os = props.os;
    this.props.markdown = props.markdown;
    this.props.minimumRequirements = props.minimumRequirements;
    this.props.recommendedRequirements = props.recommendedRequirements;
    this.props.slug = props.slug;

    return Result.ok();
  }

  public updateMedia(props: UpdateProductMediaProps): Result<void, DomainValidationError> {
    const schema = z.object({
      videos: z.array(z.url()).min(1),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    this.props.allImages = props.allImages;
    this.props.images = props.images;
    this.props.videos = props.videos;

    if (props.cover) {
      this.props.cover = props.cover;
    }

    return Result.ok();
  }

  public updateMeta(meta: Meta) {
    this.props.meta = meta;
  }

  public updateStatus(status: ProductStatus) {
    this.props.status = status;
  }

  public updateRating(rating: ProductRating) {
    this.props.rating = rating;
  }

  get _id() {
    return this.props._id;
  }

  get cover() {
    return this.props.cover;
  }

  get allImages() {
    return this.props.allImages;
  }

  get images() {
    return this.props.images;
  }

  get videos() {
    return this.props.videos;
  }

  get status() {
    return this.props.status;
  }

  get title() {
    return this.props.title;
  }

  get price() {
    return this.props.price;
  }

  get genres() {
    return this.props.genres;
  }

  get releaseDate() {
    return this.props.releaseDate;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get publisher() {
    return this.props.publisher;
  }

  get platform() {
    return this.props.platform;
  }

  get developers() {
    return this.props.developers;
  }

  get features() {
    return this.props.features;
  }

  get link() {
    return this.props.link;
  }

  get os() {
    return this.props.os;
  }

  get markdown() {
    return this.props.markdown;
  }

  get minimumRequirements() {
    return this.props.minimumRequirements;
  }

  get recommendedRequirements() {
    return this.props.recommendedRequirements;
  }

  get slug() {
    return this.props.slug;
  }

  get keys() {
    return this.props.keys;
  }

  get rating() {
    return this.props.rating;
  }

  get reviews() {
    return this.props.reviews;
  }

  get discount() {
    return this.props.discount;
  }

  get meta() {
    return this.props.meta;
  }

  set keys(value) {
    this.props.keys = value;
  }
}

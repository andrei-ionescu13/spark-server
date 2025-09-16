import * as z from 'zod';
import { textUtils } from '../../utils/textUtils';
import { Asset } from '../blog/article/asset';
import { DomainValidationError } from '../blog/article/status';
import { Meta } from '../meta';
import { Result } from '../Result';
import { zodDomainValidationError } from '../zodErrors';
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
  images: Asset[];
  selectedImages: Asset[];
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
  os: string;
  markdown: ProductMarkdown;
  meta: Meta;
  minimumRequirements: ProductRequirements;
  recommendedRequirements: ProductRequirements;
  slug: string;
  keys: string[];
  rating: ProductRating;
  reviews: string[];
  discount: string;
}

interface ProductCreateProps extends Omit<ProductProps, 'createdAt' | 'updatedAt' | 'slug'> {
  createdAt?: Date;
  updatedAt?: Date | null;
  slug?: string;
}

export class Product {
  constructor(private props: ProductProps) {}

  public static create(props: ProductCreateProps): Result<Product, DomainValidationError> {
    const schema = z.object({
      _id: z.uuidv7(),
      videos: z.array(z.url()).min(1),
      genres: z.array(z.uuidv7()).min(1),
      releaseDate: z.date(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
      publisher: z.uuidv7(),
      platform: z.uuidv7(),
      developers: z.array(z.uuidv7()).min(1),
      features: z.array(z.uuidv7()).min(1),
      os: z.uuidv7(),
      slug: z.string().min(1).optional(),
      keys: z.array(z.uuidv7()),
      reviews: z.array(z.uuidv7()),
      discount: z.uuidv7(),
    });

    const result = schema.safeParse(props);

    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Product({
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || null,
        slug: props.slug || textUtils.generateSlug(props.title.value),
      }),
    );
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

  get _id() {
    return this.props._id;
  }

  get cover() {
    return this.props.cover;
  }

  get images() {
    return this.props.images;
  }

  get selectedImages() {
    return this.props.selectedImages;
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
}

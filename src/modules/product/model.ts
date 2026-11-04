import { AssetDoc } from '../../assets';
import { MetaDoc } from '../../meta';
import { DiscountDoc } from '../discount/model';
import { Developer } from './developer/domain/developer';
import { DeveloperDoc } from './developer/model';
import { Feature } from './feature/domain/feature';
import { FeatureDoc } from './feature/model';
import { GenreDoc } from './genre/model';
import { OperatingSystemDoc } from './operatingSystem/model';
import { Platform } from './platform/domain/platform';
import { PlatformDoc } from './platform/model';
import { PublisherDoc } from './publisher/model';

type Status = 'draft' | 'published' | 'archived';

export interface ProductDoc {
  _id: string;
  cover: AssetDoc;
  allImages: AssetDoc[];
  images: AssetDoc[];
  videos: string[];
  status: Status;
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
  meta: MetaDoc;
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

export interface ProductPopulatedDoc
  extends Omit<
    ProductDoc,
    'genres' | 'developers' | 'features' | 'os' | 'publisher' | 'platform' | 'discount'
  > {
  genres: GenreDoc[];
  developers: DeveloperDoc[];
  features: FeatureDoc[];
  os: OperatingSystemDoc[];
  publisher: PublisherDoc;
  platform: PlatformDoc;
  discount: DiscountDoc | null;
}

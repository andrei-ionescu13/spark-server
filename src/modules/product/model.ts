import { AssetDoc } from '../../Asset';
import { MetaDoc } from '../../Meta';

type Status = 'draft' | 'published' | 'archived';

export interface ProductDoc {
  _id: string;
  cover: AssetDoc;
  images: AssetDoc[];
  selectedImages: AssetDoc[];
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
  os: string;
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

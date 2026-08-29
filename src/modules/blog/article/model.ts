import { AssetDoc } from '../../../Asset';
import { Meta } from '../../../meta';

type Status = 'draft' | 'published' | 'archived';

export interface ArticleDoc {
  title: string;
  description: string;
  slug: string;
  status: Status;
  category: string;
  markdown: string;
  cover: AssetDoc;
  meta: Meta;
  createdAt: Date;
  updatedAt: Date | null;
  tags: string[];
  _id: string;
}

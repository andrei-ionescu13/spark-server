import { AssetDoc } from '../../../Asset';
import { MetaDoc } from '../../../Meta';
import { ArticleCategory } from '../article-category/domain/articleCategory';
import { ArticleCategoryDoc } from '../article-category/model';
import { ArticleTag } from '../article-tag/domain/articleTag';
import { ArticleTagDoc } from '../article-tag/model';

type Status = 'draft' | 'published' | 'archived';

export interface ArticleDoc {
  title: string;
  description: string;
  slug: string;
  status: Status;
  category: string;
  markdown: string;
  cover: AssetDoc;
  meta: MetaDoc;
  createdAt: Date;
  updatedAt: Date | null;
  tags: string[];
  _id: string;
}

export interface ArticlePopulatedDoc extends Omit<ArticleDoc, 'category' | 'tags'> {
  category: ArticleCategoryDoc;
  tags: ArticleTagDoc[];
}

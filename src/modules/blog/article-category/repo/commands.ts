import { Collection, ObjectId } from 'mongodb';
import { ArticleCategory } from '../domain/articleCategory';
import { ArticleCategoryMapper } from '../articleCategoryMapper';
import { ArticleCategoryDoc } from '../model';

export interface ArticleCategoryCommandsRepoI {
  save: (articleCategory: ArticleCategory) => Promise<void>;
  getArticleCategory: (id: string) => Promise<ArticleCategory | null>;
  deleteArticleCategory: (id: string) => Promise<void>;
}

export class ArticleCategoryCommandsRepo implements ArticleCategoryCommandsRepoI {
  constructor(private collection: Collection<ArticleCategoryDoc>) {}

  save = async (articleCategory: ArticleCategory) => {
    const persistence = ArticleCategoryMapper.toPersistance(articleCategory);

    await this.collection.updateOne(
      { _id: articleCategory._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getArticleCategory = async (id: string): Promise<ArticleCategory | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const articleCategory = ArticleCategoryMapper.toDomain(doc);
    return articleCategory;
  };

  deleteArticleCategory = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };

  listArticleCategories = async () => {
    const entities = await this.collection.find({});
    return entities.map((entity) => ArticleCategoryMapper.toDomain(entity));
  };
}

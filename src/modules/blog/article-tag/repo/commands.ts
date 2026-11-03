import { Collection } from 'mongodb';
import { ArticleTag } from '../domain/articleTag';
import { ArticleTagMapper } from '../articleTagMapper';
import { ArticleTagDoc } from '../model';

export interface ArticleTagCommandsRepoI {
  save: (articleTag: ArticleTag) => Promise<void>;
  getArticleTag: (id: string) => Promise<ArticleTag | null>;
  deleteArticleTag: (id: string) => Promise<void>;
}

export class ArticleTagCommandsRepo implements ArticleTagCommandsRepoI {
  constructor(private collection: Collection<ArticleTagDoc>) {}

  save = async (articleTag: ArticleTag) => {
    const persistence = ArticleTagMapper.toPersistance(articleTag);
    await this.collection.updateOne(
      { _id: articleTag._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getArticleTag = async (id: string): Promise<ArticleTag | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const articleTag = ArticleTagMapper.toDomain(doc);
    return articleTag;
  };

  deleteArticleTag = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}

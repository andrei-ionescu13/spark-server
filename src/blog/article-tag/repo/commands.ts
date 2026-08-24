import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { ArticleTag } from '../articleTag';
import { ArticleTagMapper } from '../articleTagMapper';
import { ArticleTagDoc } from '../model';
import { Result } from '../../../Result';
import { MappingValidationError } from '../../article/status';

export interface ArticleTagCommandsRepoI {
  save: (articleTag: ArticleTag) => Promise<void>;
  getArticleTag: (id: string) => Promise<Result<ArticleTag | null, MappingValidationError>>;
  deleteArticleTag: (id: string) => Promise<void>;
}

export class ArticleTagCommandsRepo implements ArticleTagCommandsRepoI {
  constructor(private articleTagModel: Model<ArticleTagDoc>) {}

  save = async (articleTag: ArticleTag) => {
    const persistance = ArticleTagMapper.toPersistance(articleTag);
    await this.articleTagModel.updateOne(
      { _id: persistance._id },
      { set: persistance },
      { upsert: true },
    );
  };

  getArticleTag = async (
    id: string,
  ): Promise<Result<ArticleTag | null, MappingValidationError>> => {
    const doc = await this.articleTagModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) {
      return Result.ok(null);
    }

    const articleTagOrError = ArticleTagMapper.toDomain(doc);
    if (articleTagOrError.isErr()) {
      return Result.fail(new MappingValidationError(articleTagOrError.error.message));
    }

    return Result.ok(articleTagOrError.value);
  };

  deleteArticleTag = async (id: string) => {
    await this.articleTagModel.deleteOne({ _id: id });
  };
}

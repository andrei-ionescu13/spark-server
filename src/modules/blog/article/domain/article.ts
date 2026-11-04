import { textUtils } from '../../../../utils/textUtils';
import { Entity } from '../../../../entity';
import { Meta } from '../../../../meta';
import { ArticleMarkdown } from './markdown';
import { DomainValidationError, ArticleStatus } from './status';
import { ArticleTitle } from './title';
import { v7 as uuid7 } from 'uuid';
import { ArticleDescription } from './description';
import { Asset } from '../../../../assets';
import { ArticleCategory } from '../../article-category/domain/articleCategory';
import { Result } from '../../../../result';
import * as z from 'zod';
import { zodDomainValidationError } from '../../../../zodErrors';

interface ArticleProps {
  _id: string;
  title: ArticleTitle;
  createdAt: Date;
  description: ArticleDescription;
  slug: string;
  markdown: ArticleMarkdown;
  updatedAt: Date | null;
  status: ArticleStatus;
  category: string;
  meta: Meta;
  tags: string[];
  cover: Asset;
}

export interface CreateArticleProps extends Omit<ArticleProps, 'createdAt' | '_id' | 'updatedAt'> {}
export interface UpdateArticleDetailsProps
  extends Pick<ArticleProps, 'title' | 'slug' | 'description' | 'markdown'> {
  cover?: Asset;
}

export class Article extends Entity<ArticleProps> {
  private constructor(props: ArticleProps) {
    super(props);
  }

  static create(props: CreateArticleProps): Result<Article, DomainValidationError> {
    const schema = z.object({
      category: z.uuidv7(),
    });

    const result = schema.safeParse(props);
    if (result.error) {
      return Result.fail(zodDomainValidationError(result.error));
    }

    return Result.ok(
      new Article({
        ...props,
        slug: props.slug || textUtils.generateSlug(props.title.value),
        _id: uuid7(),
        createdAt: new Date(),
        updatedAt: null,
      }),
    );
  }

  public static reconstitute(props: ArticleProps) {
    return new Article(props);
  }

  public updateCategory(category: string) {
    if (this.isArchived) {
      return Result.fail(new DomainValidationError(`Can't update an archived article`));
    }

    this.props.category = category;
    return Result.ok();
  }

  public updateTags(tags: string[]) {
    if (this.isArchived) {
      return Result.fail(new DomainValidationError(`Can't update an archived article`));
    }

    this.props.tags = tags;
    return Result.ok();
  }

  public updateStatus(status: ArticleStatus) {
    if (this.isArchived) {
      return Result.fail(new DomainValidationError(`Can't update an archived article`));
    }

    this.props.status = status;
    return Result.ok();
  }

  public updateMeta(meta: Meta) {
    if (this.isArchived) {
      return Result.fail(new DomainValidationError(`Can't update an archived article`));
    }

    this.props.meta = meta;
    return Result.ok();
  }

  public updateDetails({ description, markdown, slug, title, cover }: UpdateArticleDetailsProps) {
    if (this.isArchived) {
      return Result.fail(new DomainValidationError(`Can't update an archived article`));
    }

    this.props.description = description;
    this.props.markdown = markdown;
    this.props.slug = slug;
    this.props.title = title;

    if (cover) {
      this.props.cover = cover;
    }

    return Result.ok();
  }

  get _id() {
    return this.props._id;
  }

  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  get cover() {
    return this.props.cover;
  }

  get category() {
    return this.props.category;
  }

  get meta() {
    return this.props.meta;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get status() {
    return this.props.status;
  }

  get tags() {
    return this.props.tags;
  }

  get markdown() {
    return this.props.markdown;
  }

  get description() {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get isDraft() {
    return this.props.status.value === 'draft';
  }

  get isPublished() {
    return this.props.status.value === 'published';
  }

  get isArchived() {
    return this.props.status.value === 'archived';
  }
}

import { textUtils } from '../../../utils/textUtils';
import { Entity } from '../../entity';
import { Meta } from '../../Meta';
import { Asset } from './asset';
import { Description } from './description';
import { Markdown } from './markdown';
import { Status } from './status';
import { Title } from './title';

interface ArticleProps {
  _id: string;
  title: Title;
  createdAt: Date;
  description: Description;
  slug: string;
  markdown: Markdown;
  updatedAt: Date | null;
  status: Status;
  category: string;
  meta: Meta;
  tags: string[];
  cover: Asset;
}

export class Article extends Entity<ArticleProps> {
  private constructor(props: ArticleProps) {
    super(props);
  }

  static create(props: ArticleProps) {
    return new Article({ ...props, slug: props.slug || textUtils.generateSlug(props.title.value) });
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

  isDraft() {
    return this.props.status.value === 'draft';
  }

  isPublished() {
    return this.props.status.value === 'published';
  }

  isArchived() {
    return this.props.status.value === 'archived';
  }
}

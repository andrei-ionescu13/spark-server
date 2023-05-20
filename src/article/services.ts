import { articleDb } from './index';
import { ForbiddenError, NotFoundError } from '../errors';
// import { uploader } from '../services/uploaderService';

const searchArticles = async (query) => {
  const articles = await articleDb.searchArticles(query);
  const count = await articleDb.getArticlesCount(query);

  return {
    articles,
    count,
  };
};

// const createArticle = async (props, coverFile, shouldPublish) => {
//   const uploadedCover = await uploader.uploadFile(coverFile);

//   props.cover = uploadedCover;
//   props.status = shouldPublish ? 'published' : 'draft';

//   const article = await articleDb.createArticle(props);
//   return article;
// };

// const getArticle = (id) => articleDb.getArticle(id);

// const deleteArticle = async (id) => {
//   const article = await articleDb.getArticle(id);

//   if (!article) {
//     throw new NotFoundError('article not found');
//   }

//   await articleDb.deleteArticle(id);
//   await uploader.delete(article.cover.public_id);
// };

// const updateArticleMeta = async (id, props) => {
//   const article = await articleDb.getArticle(id);

//   if (article.status === 'archived') {
//     throw new ForbiddenError(`can't update an archived article`);
//   }

//   const updatedArticle = await articleDb.updateArticle(id, { meta: props });
//   return updatedArticle;
// };

// const updateArticleDetails = async (id, props, coverFile) => {
//   const article = await articleDb.getArticle(id);

//   if (!article) {
//     res.status(404).send();
//     return;
//   }

//   if (article.status === 'archived') {
//     throw new ForbiddenError(`can't update an archived article`);
//   }

//   if (coverFile) {
//     const fileUploaded = await uploader.uploadFile(coverFile);
//     props.cover = fileUploaded;
//     await uploader.delete(article.cover.public_id);
//   } else {
//     delete props.cover;
//   }

//   const updatedArticle = await articleDb.updateArticle(id, props);
//   return updatedArticle;
// };

// const updateArticleStatus = async (id, status) => {
//   const article = await articleDb.getArticle(id);

//   if (article.status === 'archived' && status === 'archived') {
//     throw new ForbiddenError(`can't update an archived article`);
//   }

//   const updatedArticle = await articleDb.updateArticle(id, { status });

//   return updatedArticle;
// };
// const updateArticleCategory = async (id, category) => {
//   const article = await articleDb.getArticle(id);

//   if (article.status === 'archived') {
//     throw new ForbiddenError(`can't update an archived article`);
//   }

//   const updatedArticle = await articleDb.updateArticle(id, { category });

//   return updatedArticle;
// };

export const articleServices = {
  searchArticles,
  // createArticle,
  // getArticle,
  // deleteArticle,
  // updateArticleMeta,
  // updateArticleDetails,
  // updateArticleStatus,
  // updateArticleCategory,
};

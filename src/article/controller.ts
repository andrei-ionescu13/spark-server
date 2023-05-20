import Joi from 'joi';
import { articleServices } from './index';

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  slug: Joi.string().required(),
  shouldPublish: Joi.boolean(),
  category: Joi.any().valid('news', 'games', 'reviews').required(),
  markdown: Joi.string().required(),
  meta: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    keywords: Joi.array().min(1).required(),
  }),
  cover: Joi.any().required(),
});

const updateArticleMetaSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  keywords: Joi.array().min(1).required(),
});

const updateArticleStatusAndTagSchema = Joi.object({
  status: Joi.any().valid('published', 'draft', 'archived'),
  category: Joi.any().valid('news', 'games', 'reviews').required(),
});

const updateArticleDetailsSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  slug: Joi.string().required(),
  markdown: Joi.string().required(),
  cover: Joi.any().required(),
});

export const articleController = {
  searchArticles: async (req, res, next) => {
    try {
      const result = await articleServices.searchArticles(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // createArticle: async (req, res, next) => {
  //   const { error } = schema.validate({
  //     ...req.body,
  //     cover: req.file,
  //   });

  //   if (error) {
  //     next(new ValidationError(error.message));
  //     return;
  //   }

  //   try {
  //     let { shouldPublish, ...props } = req.body;
  //     shouldPublish = JSON.parse(shouldPublish);
  //     const article = await articleServices.createArticle(props, req.file, shouldPublish);
  //     res.status(201).send({ id: article._id });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  // getArticle: async (req, res) => {
  //   const { id } = req.params;
  //   const article = await articleServices.getArticle(id);
  //   res.json(article);
  // },

  // deleteArticle: async (req, res, next) => {
  //   const { id } = req.params;
  //   try {
  //     await articleServices.deleteArticle(id);
  //     res.status(204).send();
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  // deleteMultipleArticles: async (req, res) => {
  //   const { ids } = req.body;
  //   await ids.map((id) => articleServices.deleteArticle(id));
  //   res.status(204).send();
  // },

  // updateArticle: async (req, res, next) => {
  //   const { id } = req.params;
  //   const props = req.body;

  //   const { error } = schema.validate({
  //     ...props,
  //     cover: props.cover || req.file,
  //   });

  //   if (error) {
  //     next(new ValidationError(error.message));
  //     return;
  //   }

  //   const article = await articleServices.updateArticle(id, props, req.file);
  //   res.json({ article });
  // },

  // duplicateArticle: async (req, res) => {
  //   const { id } = req.params;
  //   const article = await articleDb.duplicateArticle(id);
  //   res.status(201).json({ id: article._id });
  // },

  // updateArticleMeta: async (req, res, next) => {
  //   const { id } = req.params;
  //   const props = req.body;
  //   const { error } = updateArticleMetaSchema.validate(props);

  //   if (error) {
  //     next(new ValidationError(error.message));
  //     return;
  //   }

  //   const { meta, updatedAt } = await articleServices.updateArticleMeta(id, props);
  //   res.json({ meta, updatedAt });
  // },

  // updateArticleStatus: async (req, res, next) => {
  //   const { id } = req.params;
  //   const { status } = req.body;

  //   const article = await articleServices.updateArticleStatus(id, status);
  //   res.json({ status: article.status });
  // },

  // updateArticleCategory: async (req, res, next) => {
  //   const { id } = req.params;
  //   const { category } = req.body;

  //   const article = await articleServices.updateArticleCategory(id, category);
  //   res.json({ category: article.category });
  // },

  // updateArticleDetails: async (req, res, next) => {
  //   const { id } = req.params;
  //   const props = req.body;

  //   const { error } = updateArticleDetailsSchema.validate({
  //     ...props,
  //     cover: props.cover || req?.file,
  //   });

  //   if (error) {
  //     next(new ValidationError(error.message));
  //     return;
  //   }

  //   const { description, title, slug, markdown, cover, updatedAt } =
  //     await articleServices.updateArticleDetails(id, props, req?.file);

  //   res.json({
  //     description,
  //     title,
  //     slug,
  //     markdown,
  //     cover,
  //     updatedAt,
  //   });
  // },
};

import Joi from 'joi';
import { validate } from '../validate';

export const namespaceValidation = {
  createProduct: (values) => {
    const schema = Joi.object({
      title: Joi.string().min(3).max(64).required(),
      shouldPublish: Joi.boolean().required(),
      markdown: Joi.string().min(256).max(4096).required(),
      price: Joi.number().min(0),
      initialPrice: Joi.number().min(0).required(),
      genres: Joi.array().items(Joi.string()).min(1).required(),
      selectedImages: Joi.array().items(Joi.string()).min(1).required(),
      videos: Joi.array().items(Joi.string()).min(1).required(),
      developers: Joi.array().items(Joi.string()).min(1).required(),
      features: Joi.array().items(Joi.string()).min(1).required(),
      languages: Joi.array().items(Joi.string()).min(1).required(),
      releaseDate: Joi.date().required(),
      publisher: Joi.string().required(),
      link: Joi.string().required(),
      platform: Joi.array().valid('windows', 'mac', 'linux'),
      slug: Joi.string().min(3).max(256).required(),
      metaTitle: Joi.string().min(3).max(128).required(),
      metaDescription: Joi.string().min(3).max(512).required(),
      metaKeywords: Joi.array().min(1).required(),
    });

    validate(schema, values);
  },
  updateProductGeneral: (values) => {
    const schema = Joi.object({
      title: Joi.string().min(3).max(64).required(),
      markdown: Joi.string().min(256).max(4096).required(),
      price: Joi.number().min(0),
      initialPrice: Joi.number().min(0).required(),
      genres: Joi.array().items(Joi.string()).min(1).required(),
      developers: Joi.array().items(Joi.string()).min(1).required(),
      features: Joi.array().items(Joi.string()).min(1).required(),
      languages: Joi.array().items(Joi.string()).min(1).required(),
      releaseDate: Joi.date().required(),
      publisher: Joi.string().required(),
      link: Joi.string().required(),
      platform: Joi.array().valid('windows', 'mac', 'linux'),
      slug: Joi.string().min(3).max(256).required(),
    });

    validate(schema, values);
  },
  updateProductStatus: (values) => {
    const schema = Joi.object({
      status: Joi.string().valid('published', 'draft', 'archived').required(),
    });

    validate(schema, values);
  },
  updateProductMeta: (values) => {
    const schema = Joi.object({
      metaTitle: Joi.string().min(3).max(128).required(),
      metaDescription: Joi.string().min(3).max(512).required(),
      metaKeywords: Joi.array().min(1).required(),
    });

    validate(schema, values);
  },
  updateProductStatus: (values) => {
    const schema = Joi.object({
      status: Joi.string().valid('published', 'draft', 'archived').required(),
    });

    validate(schema, values);
  },
};

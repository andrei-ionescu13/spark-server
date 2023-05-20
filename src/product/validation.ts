import Joi from 'joi';
import { validate } from '../validate';

export const productValidation = {
  createProduct: (values) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      minimumRequirements: Joi.string().required(),
      recommendedRequirements: Joi.string().required(),
      shouldPublish: Joi.boolean().required(),
      markdown: Joi.string().required(),
      price: Joi.number().min(0).required(),
      initialPrice: Joi.number().min(0).required(),
      genres: Joi.array().items(Joi.string()).min(1).required(),
      selectedImages: Joi.array().items(Joi.string()).min(1).required(),
      videos: Joi.array().items(Joi.string()).min(1).required(),
      developers: Joi.array().items(Joi.string()).min(1).required(),
      features: Joi.array().items(Joi.string()).min(1).required(),
      languages: Joi.array().items(Joi.string()).min(1).required(),
      releaseDate: Joi.date().required(),
      publisher: Joi.string().required(),
      platform: Joi.string().required(),
      link: Joi.string().required(),
      os: Joi.array().items(Joi.string().valid('Windows', 'Mac', 'Linux')).required(),
      slug: Joi.string().required(),
      metaTitle: Joi.string().required(),
      metaDescription: Joi.string().required(),
      metaKeywords: Joi.array().min(1).required(),
    });

    validate(schema, values);
  },
  updateProductGeneral: (values) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      minimumRequirements: Joi.string().required(),
      recommendedRequirements: Joi.string().required(),
      markdown: Joi.string().required(),
      price: Joi.number().required(),
      initialPrice: Joi.number().required(),
      genres: Joi.array().items(Joi.string()).min(1).required(),
      developers: Joi.array().items(Joi.string()).min(1).required(),
      features: Joi.array().items(Joi.string()).min(1).required(),
      languages: Joi.array().items(Joi.string()).min(1).required(),
      releaseDate: Joi.date().required(),
      publisher: Joi.string().required(),
      platform: Joi.string().required(),
      link: Joi.string().required(),
      os: Joi.array().items(Joi.string().valid('Windows', 'Mac', 'Linux')).required(),
      slug: Joi.string().required(),
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
      metaTitle: Joi.string().required(),
      metaDescription: Joi.string().required(),
      metaKeywords: Joi.array().items(Joi.string()).min(1).required(),
    });
    validate(schema, values);
  },
  // updateProductStatus: (values) => {
  //   const schema = Joi.object({
  //     status: Joi.string().valid('published', 'draft', 'archived').required(),
  //   });

  //   validate(schema, values);
  // },
};

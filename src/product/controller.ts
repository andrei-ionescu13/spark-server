import Joi from 'joi';
import { productDb, productServices } from './index';
import { KeyModel } from '../key/index';
import { productValidation } from './validation';

export const productController = {
  createProduct: async (req, res, next) => {
    try {
      productValidation.createProduct(req.body);
      const { shouldPublish, ...props } = req.body;
      props.status = shouldPublish ? 'published' : 'draft';
      const product = await productServices.createProduct(
        props,
        req.files.cover[0],
        req.files['images[]'],
        req.files.keys[0],
      );
      res.json({ id: product._id });
    } catch (error) {
      next(error);
    }
  },

  getProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await productServices.getProduct(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      await productServices.deleteProduct(id);

      res.status(200).json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  deleteMultipleProducts: async (req, res, next) => {
    try {
      const { ids } = req.body;
      await Promise.all(ids.map((id) => productServices.deleteProduct(id)));

      res.status(200).json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  updateProductStatus: async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      productValidation.updateProductStatus({ status });

      const updatedProduct = await productServices.updateProductStatus(id, status);
      res.json(updatedProduct.status);
    } catch (error) {
      next(error);
    }
  },

  updateProductMeta: async (req, res, next) => {
    const { id } = req.params;
    const props = req.body;

    try {
      productValidation.updateProductMeta(props);

      const updatedProduct = await productServices.updateProduct(id, props);
      const { metaTitle, metaKeywords, metaDescription } = updatedProduct;
      res.json({ metaTitle, metaKeywords, metaDescription });
    } catch (error) {
      next(error);
    }
  },

  updateProductGeneral: async (req, res, next) => {
    const { id } = req.params;
    const props = req.body;

    try {
      productValidation.updateProductGeneral(props);

      const updatedProduct = await productServices.updateProduct(id, props);
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },

  updateProductMedia: async (req, res, next) => {
    const { id } = req.params;
    const props = {
      ...req.body,
      images: req.body?.images || [],
      selectedImages: req.body?.selectedImages || [],
    };

    try {
      const updatedProduct = await productServices.updateProductMedia(
        id,
        props,
        req.files?.cover?.[0],
        req.files?.['images[]'],
      );
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },

  // updateProductMeta: async (req, res, next) => {
  //   const { id } = req.params;
  //   const props = req.body;
  //   productValidation.updateProductMeta(props);
  //   await productServices.updateProduct(id, props);
  //   res.send({ ok: 'ok' });
  // },

  searchProductKeys: async (req, res) => {
    const { id } = req.params;
    const keys = await productDb.searchProductKeys(id, req.query);

    res.json(keys);
  },

  deleteProductKey: async (req, res) => {
    const { id, keyId } = req.params;
    await productDb.deleteProductKey(id, keyId);

    res.json({ ok: 'ok' });
  },

  addProductKey: async (req, res) => {
    const { id } = req.params;
    const { key } = req.body;

    await productDb.addProductKey(id, key);
    res.json({ ok: 'ok' });
  },

  importProductKeys: async (req, res, next) => {
    const { id } = req.params;
    const keysFile = req.file;

    try {
      await productServices.importProductKeys(id, keysFile);
      res.json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  searchProductReviews: async (req, res) => {
    const { id } = req.params;
    const result = await productServices.searchProductReviews(id, req.query);
    res.json(result);
  },
};

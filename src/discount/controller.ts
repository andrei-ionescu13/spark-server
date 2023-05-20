import { discountDb } from './index';
import { productDb } from '../product/index';
import { ValidationError } from '../errors';
import dotenv from 'dotenv';
import { discountService } from './services';
dotenv.config();

export const discountController = {
  // getDiscount: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;
  //     const discount = await discountService.getDiscount(id);
  //     res.json(discount);
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  deleteDiscount: async (req, res, next) => {
    try {
      const { id } = req.params;
      const discount = await discountService.deleteDiscount(id);
      res.json(discount);
    } catch (error) {
      next(error);
    }
  },

  deleteMultipleDiscounts: async (req, res, next) => {
    try {
      const { ids } = req.body;
      await Promise.all(ids.map((id) => discountService.deleteDiscount(id)));
      res.status(200).json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  updateDiscount: async (req, res, next) => {
    try {
      const { id } = req.params;
      const props = req.body;
      const discount = await discountService.updateDiscount(id, props);
      res.json(discount);
    } catch (error) {
      next(error);
    }
  },

  // deactivateDiscount: async (req, res, next) => {
  //   try {
  //     const { id } = req.params;
  //     const discount = await discountService.deactivateDiscount(id);
  //     res.json(discount);
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  // searchDiscounts: async (req, res) => {
  //   const result = await discountService.searchDiscounts(req.query);
  //   res.json(result);
  // },

  createDiscount: async (req, res, next) => {
    try {
      const params = req.body;
      const discount = await discountService.createDiscount(params);
      res.status(201).send(discount);
    } catch (error) {
      next(error);
    }
  },
};

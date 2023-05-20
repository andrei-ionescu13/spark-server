import dotenv from 'dotenv';
import { promoCodeService } from './services';
dotenv.config();

export const promoCodeController = {
  getPromoCode: async (req, res, next) => {
    try {
      const { id } = req.params;
      const promoCode = await promoCodeService.getPromoCode(id);
      res.json(promoCode);
    } catch (error) {
      next(error);
    }
  },

  deletePromoCode: async (req, res, next) => {
    try {
      const { id } = req.params;
      const promoCode = await promoCodeService.deletePromoCode(id);
      res.json(promoCode);
    } catch (error) {
      next(error);
    }
  },

  deleteMultiplePromoCodes: async (req, res, next) => {
    try {
      const { ids } = req.body;
      await Promise.all(ids.map((id) => promoCodeService.deletePromoCode(id)));
      res.status(200).json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  updatePromoCode: async (req, res, next) => {
    try {
      const { id } = req.params;
      const props = req.body;
      const promoCode = await promoCodeService.updatePromoCode(id, props);
      res.json(promoCode);
    } catch (error) {
      next(error);
    }
  },

  deactivatePromoCode: async (req, res, next) => {
    try {
      const { id } = req.params;
      const promoCode = await promoCodeService.deactivatePromoCode(id);
      res.json(promoCode);
    } catch (error) {
      next(error);
    }
  },

  searchPromoCodes: async (req, res) => {
    const result = await promoCodeService.searchPromoCodes(req.query);
    res.json(result);
  },

  createPromoCode: async (req, res, next) => {
    try {
      const params = req.body;
      const promoCode = await promoCodeService.createPromoCode(params);
      res.status(201).send(promoCode);
    } catch (error) {
      next(error);
    }
  },
};

import Joi from 'joi';
import { currencyServices } from './index';
import { KeyModel } from '../key/index';
import { uploader } from '../services/uploaderService';
import { productValidation } from './validation';

export const currencyController = {
  createCurrency: async (req, res, next) => {
    const props = req.body;

    try {
      const currency = await currencyServices.createCurrency(props);
      res.json(currency);
    } catch (error) {
      next(error);
    }
  },

  deleteCurrency: async (req, res, next) => {
    const { id } = req.params;

    try {
      await currencyServices.deleteCurrency(id);
      res.json({ ok: 'ok' });
    } catch (error) {
      next(error);
    }
  },

  listCurrencies: async (req, res, next) => {
    try {
      const currencys = await currencyServices.listCurrencys();
      res.json(currencys);
    } catch (error) {
      next(error);
    }
  },

  searchCurrencies: async (req, res, next) => {
    try {
      const result = await currencyServices.searchCurrencies(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};

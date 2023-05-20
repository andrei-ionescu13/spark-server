import Joi from 'joi';
import { genreDb } from './index';
import { productDb } from '../product/index';
import { ValidationError } from '../errors';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const schema = Joi.object({
  name: Joi.string().min(4).max(64).required(),
});

export const genreController = {
  searchGenres: async (req, res) => {
    const genres = await genreDb.searchGenres(req.query);
    const count = await genreDb.getGenresCount(req.query);
    res.json({ genres, count });
  },

  createGenre: async (req, res, next) => {
    const params = req.body;
    const { error } = schema.validate(params);

    if (error) {
      next(new ValidationError(error.message));
      return;
    }

    const genre = await genreDb.createGenre(params);
    res.status(201).send({ genre });
  },

  deleteGenre: async (req, res) => {
    const { id } = req.params;
    const genre = await genreDb.getGenre(id);

    if (!genre) {
      res.status(404).send();
      return;
    }

    await genreDb.deleteGenre(id);
    await productDb.deleteProductsGenre(id);

    res.status(200).json({ ok: 'ok' });
  },

  deleteMultipleGenres: async (req, res) => {
    const { ids } = req.body;
    const genres = await genreDb.listGenres(ids);

    if (!genres) {
      res.status(404).send();
      return;
    }

    await genreDb.deleteMultipleGenres(ids);

    res.status(200).json({ ok: 'ok' });
  },

  updateGenre: async (req, res, next) => {
    const { id } = req.params;
    const props = req.body;

    const { error } = schema.validate(props);

    if (error) {
      next(new ValidationError(error.message));
      return;
    }

    const genre = await genreDb.getGenre(id);

    if (!genre) {
      res.status(404).send();
      return;
    }

    const updatedGenre = await genreDb.updateGenre(id, props);
    res.json({ genre: updatedGenre });
  },

  listGenres: async (req, res) => {
    const genres = await genreDb.listGenres();
    res.json(genres);
  },
};

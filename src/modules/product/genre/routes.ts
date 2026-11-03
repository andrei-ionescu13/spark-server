import type { Request, Response } from 'express';
import express from 'express';
import { createGenreController } from './useCases/createGenre';
import { deleteGenreController } from './useCases/deleteGenre';
import { deleteGenreBulkController } from './useCases/deleteGenreBulk';
import { listGenresController } from './useCases/listGenres';
import { searchGenreController } from './useCases/searchGenres';
import { updateGenreController } from './useCases/updateGenre';
const router = express.Router();

router.get('/search', (req: Request, res: Response) => searchGenreController.execute(req, res));

router.get('/', (req: Request, res: Response) => listGenresController.execute(req, res));

router.post('/', (req: Request, res: Response) => createGenreController.execute(req, res));

router.put('/:genreId', (req: Request, res: Response) => updateGenreController.execute(req, res));

router.delete('/', (req: Request, res: Response) => deleteGenreBulkController.execute(req, res));

router.delete('/:genreId', (req: Request, res: Response) =>
  deleteGenreController.execute(req, res),
);

export default router;

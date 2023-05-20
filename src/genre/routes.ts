import express, { Request, Response } from 'express';
import { deleteGenreController } from './useCases/deleteGenre';
import { listGenresController } from './useCases/listGenres';
import { searchGenresController } from './useCases/searchGenres';
import { updateGenreController } from './useCases/updateGenre';
import { addGenreController } from './useCases/addGenre';
import { deleteGenresBulkController } from './useCases/deleteGenresBulk';
const router = express.Router();

router.get('/search', (req: Request, res: Response) => searchGenresController.execute(req, res));
router.get('/', (req: Request, res: Response) => listGenresController.execute(req, res));
router.post('/', (req: Request, res: Response) => addGenreController.execute(req, res));
router.delete('/:genreId', (req: Request, res: Response) =>
  deleteGenreController.execute(req, res),
);
router.delete('/', (req: Request, res: Response) => deleteGenresBulkController.execute(req, res));
router.put('/:genreId', (req: Request, res: Response) => updateGenreController.execute(req, res));

export default router;

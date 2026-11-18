import { Mongo } from '../../../../../mongo';
import { ProductQueriesRepo } from '../../../repo/queries';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { DeleteGenreController } from './deleteGenreController';
import { DeleteGenreUseCase } from './deleteGenreUseCase';

const productQueriesRepo = new ProductQueriesRepo();
const genreCommandsRepo = new GenreCommandsRepo();
const genreQueriesRepo = new GenreQueriesRepo();

const deleteGenreUseCase = new DeleteGenreUseCase(
  productQueriesRepo,
  genreCommandsRepo,
  genreQueriesRepo,
);
export const deleteGenreController = new DeleteGenreController(deleteGenreUseCase);

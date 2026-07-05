import { ProductModel } from '../../../model';
import { ProductQueriesRepo } from '../../../repo/queries';
import { GenreModel } from '../../model';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { DeleteGenreController } from './deleteGenreController';
import { DeleteGenreUseCase } from './deleteGenreUseCase';

const productQueriesRepo = new ProductQueriesRepo(ProductModel);
const genreCommandsRepo = new GenreCommandsRepo(GenreModel);
const genreQueriesRepo = new GenreQueriesRepo(GenreModel);

const deleteGenreUseCase = new DeleteGenreUseCase(
  productQueriesRepo,
  genreCommandsRepo,
  genreQueriesRepo,
);
export const deleteGenreController = new DeleteGenreController(deleteGenreUseCase);

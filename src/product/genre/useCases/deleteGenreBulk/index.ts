import { ProductModel } from '../../../model';
import { ProductQueriesRepo } from '../../../repo/queries';
import { GenreModel } from '../../model';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { DeleteGenreBulkController } from './deleteGenreBulkController';
import { DeleteGenreBulkUseCase } from './deleteGenrerBulkUseCase';

const productQueriesRepo = new ProductQueriesRepo(ProductModel);
const genreCommandsRepo = new GenreCommandsRepo(GenreModel);
const genreQueriesRepo = new GenreQueriesRepo(GenreModel);

const deleteGenreBulkUseCase = new DeleteGenreBulkUseCase(
  productQueriesRepo,
  genreCommandsRepo,
  genreQueriesRepo,
);

export const deleteGenreBulkController = new DeleteGenreBulkController(deleteGenreBulkUseCase);

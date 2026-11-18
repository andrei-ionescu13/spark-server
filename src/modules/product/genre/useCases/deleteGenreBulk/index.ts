import { Mongo } from '../../../../../mongo';
import { ProductQueriesRepo } from '../../../repo/queries';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { DeleteGenreBulkController } from './deleteGenreBulkController';
import { DeleteGenreBulkUseCase } from './deleteGenrerBulkUseCase';

const productQueriesRepo = new ProductQueriesRepo();
const genreCommandsRepo = new GenreCommandsRepo();
const genreQueriesRepo = new GenreQueriesRepo();

const deleteGenreBulkUseCase = new DeleteGenreBulkUseCase(
  productQueriesRepo,
  genreCommandsRepo,
  genreQueriesRepo,
);

export const deleteGenreBulkController = new DeleteGenreBulkController(deleteGenreBulkUseCase);

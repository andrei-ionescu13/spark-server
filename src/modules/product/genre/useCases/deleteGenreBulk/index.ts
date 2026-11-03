import { Mongo } from '../../../../../mongo';
import { ProductModel } from '../../../model';
import { ProductQueriesRepo } from '../../../repo/queries';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { DeleteGenreBulkController } from './deleteGenreBulkController';
import { DeleteGenreBulkUseCase } from './deleteGenrerBulkUseCase';

const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));
const genreCommandsRepo = new GenreCommandsRepo(Mongo.getCollection('genres'));
const genreQueriesRepo = new GenreQueriesRepo(Mongo.getCollection('genres'));

const deleteGenreBulkUseCase = new DeleteGenreBulkUseCase(
  productQueriesRepo,
  genreCommandsRepo,
  genreQueriesRepo,
);

export const deleteGenreBulkController = new DeleteGenreBulkController(deleteGenreBulkUseCase);

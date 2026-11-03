import { Mongo } from '../../../../../mongo';
import { ProductModel } from '../../../model';
import { ProductQueriesRepo } from '../../../repo/queries';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { DeleteGenreController } from './deleteGenreController';
import { DeleteGenreUseCase } from './deleteGenreUseCase';

const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));
const genreCommandsRepo = new GenreCommandsRepo(Mongo.getCollection('genres'));
const genreQueriesRepo = new GenreQueriesRepo(Mongo.getCollection('genres'));

const deleteGenreUseCase = new DeleteGenreUseCase(
  productQueriesRepo,
  genreCommandsRepo,
  genreQueriesRepo,
);
export const deleteGenreController = new DeleteGenreController(deleteGenreUseCase);

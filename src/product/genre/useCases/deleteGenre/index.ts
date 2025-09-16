import { ProductModel } from '../../../../../product/model';
import { ProductRepo } from '../../../../../product/productRepo';
import { GenreModel } from '../../model';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { DeleteGenreController } from './deleteGenreController';
import { DeleteGenreUseCase } from './deleteGenreUseCase';

const productRepo = new ProductRepo(ProductModel);
const genreCommandsRepo = new GenreCommandsRepo(GenreModel);
const genreQueriesRepo = new GenreQueriesRepo(GenreModel);

const deleteGenreUseCase = new DeleteGenreUseCase(productRepo, genreCommandsRepo, genreQueriesRepo);
export const deleteGenreController = new DeleteGenreController(deleteGenreUseCase);

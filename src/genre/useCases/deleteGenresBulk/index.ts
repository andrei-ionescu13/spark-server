import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { GenreRepo } from '../../genreRepo';
import { GenreModel } from '../../model';
import { DeleteGenresBulkController } from './deleteGenresBulkController';
import { DeleteGenresBulkUseCase } from './deleteGenresBulkUseCase';

const genreRepo = new GenreRepo(GenreModel);
const productRepo = new ProductRepo(ProductModel);
const deleteGenresBulkUseCase = new DeleteGenresBulkUseCase(genreRepo, productRepo);
export const deleteGenresBulkController = new DeleteGenresBulkController(deleteGenresBulkUseCase);

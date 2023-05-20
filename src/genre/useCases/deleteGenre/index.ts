import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { GenreRepo } from '../../genreRepo';
import { GenreModel } from '../../model';
import { DeleteGenreController } from './deleteGenreController';
import { DeleteGenreUseCase } from './deleteGenreUseCase';

const genreRepo = new GenreRepo(GenreModel);
const productRepo = new ProductRepo(ProductModel);
const deleteGenreUseCase = new DeleteGenreUseCase(genreRepo, productRepo);
export const deleteGenreController = new DeleteGenreController(deleteGenreUseCase);

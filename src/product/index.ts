import { ProductRepo } from './productRepo';
import { ProductModel } from './model';
export { default as productRoutes } from './routes';
export { productServices } from './services';

export const productDb = new ProductRepo(ProductModel);

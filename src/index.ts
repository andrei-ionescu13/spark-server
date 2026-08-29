import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { collectionsRoutes } from './modules/collection';
import { currencyRoutes } from './modules/currency';
import { dealsRoutes } from './modules/deals';
import { developerRoutes } from './modules/product/developer';
import { discountRoutes } from './modules/discount';
import { languageRoutes } from './modules/internationalization/language';
import { namespaceRoutes } from './modules/internationalization/namespace';
import { keysRoutes } from './modules/key';
import { featureRoutes } from './modules/product/feature';
import { genreRoutes } from './modules/product/genre';
import { operatingSystemRoutes } from './modules/product/operatingSystem';
import { orderRoutes } from './modules/orders';
import { platformRoutes } from './modules/product/platform';
import { publisherRoutes } from './modules/product/publisher';
import { reviewsRoutes } from './modules/review';
import { userRoutes } from './modules/users';
import { authRoutes } from './modules/auth';
import { articleCategoryRoutes } from './modules/blog/article-category/index';
import { articleTagRoutes } from './modules/blog/article-tag/index';
import { articlesRoutes } from './modules/blog/article/index';
import { couponRoutes } from './modules/coupon';
import { productRoutes } from './modules/product';
import { Mongo } from './mongo';
import { verifyToken } from './middleware/verify-token';

const app = express();
const port = process.env.PORT || 3001;

const run = async () => {
  try {
    await Mongo.connect();
    console.log('connected to db');
  } catch (error) {
    console.log(error);
  }

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  );

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/public', express.static('public'));
  app.use('/', authRoutes);

  app.use(verifyToken);

  app.use((req, res, next) => {
    const { sort } = req.query;

    if (!sort || typeof sort !== 'string') {
      next();
      return;
    }

    req.query.sortBy = sort.split('-')[0];
    req.query.sortOrder = sort.split('-')[1];
    next();
  });

  app.use('/languages', languageRoutes);
  app.use('/namespaces', namespaceRoutes);
  app.use('/articles', articlesRoutes);
  app.use('/article-categories', articleCategoryRoutes);
  app.use('/article-tags', articleTagRoutes);
  app.use('/operating-systems', operatingSystemRoutes);
  app.use('/developers', developerRoutes);
  app.use('/features', featureRoutes);
  app.use('/publishers', publisherRoutes);
  app.use('/platforms', platformRoutes);
  app.use('/currencies', currencyRoutes);
  app.use('/genres', genreRoutes);
  app.use('/products', productRoutes);
  app.use('/users', userRoutes);
  app.use('/keys', keysRoutes);
  app.use('/collections', collectionsRoutes);
  app.use('/deals', dealsRoutes);
  app.use('/reviews', reviewsRoutes);
  app.use('/discounts', discountRoutes);
  app.use('/orders', orderRoutes);
  app.use('/promo-codes', couponRoutes);

  app.use((error, req, res, next) => {
    if (error) {
      console.log(error.message);
      const { status, message } = error;
      res.status(status || 500).json({ message });
    }
  });

  app.listen(port, () => {
    console.log(`server running port ${port}`);
  });
};

run();

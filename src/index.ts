import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
// import { collectionsRoutes } from '../collection/index';
import { currencyRoutes } from './currency';
// import { dealsRoutes } from '../deals/index';
import { developerRoutes } from './product/developer';
// import { discountRoutes } from '../discount/index';
import { languageRoutes } from './internationalization/language';
import { namespaceRoutes } from './internationalization/namespace';
import { keysRoutes } from './key';
import { featureRoutes } from './product/feature';
import { genreRoutes } from './product/genre';
// import { verifyToken } from '../middleware/verify-token';
import { operatingSystemRoutes } from './product/operatingSystem';
// import { orderRoutes } from '../orders/index';
import { platformRoutes } from './product/platform';
import { publisherRoutes } from './product/publisher';
// import { reviewsRoutes } from '../review/index';
// import { translationsLanguageRoutes } from '../translations-language/index';
// import { userRoutes } from '../users/index';
import { authRoutes } from './auth';
import { articleCategoryRoutes } from './blog/article-category/index';
import { articleTagRoutes } from './blog/article-tag/index';
import { articlesRoutes } from './blog/article/index';
import { couponRoutes } from './coupon';
import { productRoutes } from './product';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
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

  // app.use(verifyToken);

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
  // app.use('/users', userRoutes);
  app.use('/keys', keysRoutes);
  // app.use('/collections', collectionsRoutes);
  // app.use('/deals', dealsRoutes);
  // app.use('/reviews', reviewsRoutes);
  // app.use('/discounts', discountRoutes);
  // app.use('/orders', orderRoutes);
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

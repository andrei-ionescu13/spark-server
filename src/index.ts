import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { articlesRoutes } from './article/index';
import { genreRoutes } from './genre/index';
import { keysRoutes } from './key/index';
import { productRoutes } from './product/index';
import { publisherRoutes } from './publisher/index';
import { languageRoutes } from './language/index';
import { namespaceRoutes } from './namespace/index';
import { userRoutes } from './users/index';
import { authRoutes } from './auth/index';
import { orderRoutes } from './orders/index';
import { currencyRoutes } from './currency/index';
import { platformRoutes } from './platform/index';
import { discountRoutes } from './discount/index';
import { reviewsRoutes } from './review/index';
import { promoCodeRoutes } from './coupon/index';
import { collectionsRoutes } from './collection/index';
import { articleCategoryRoutes } from './article-category/index';
import { articleTagRoutes } from './article-tag/index';
import { verifyToken } from './middleware/verify-token';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { developerRoutes } from './developer';
import { featureRoutes } from './feature';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const run = async () => {
  mongoose.connect(process.env.MONGO_URI as string);
  console.log(process.env.MONGO_URI);
  app.use(
    cors({
      origin: '*',
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

  app.use('/articles', articlesRoutes);
  app.use('/developers', developerRoutes);
  app.use('/features', featureRoutes);
  app.use('/article-categories', articleCategoryRoutes);
  app.use('/article-tags', articleTagRoutes);
  app.use('/publishers', publisherRoutes);
  app.use('/platforms', platformRoutes);
  app.use('/currencies', currencyRoutes);
  app.use('/genres', genreRoutes);
  app.use('/languages', languageRoutes);
  app.use('/products', productRoutes);
  app.use('/users', userRoutes);
  app.use('/keys', keysRoutes);
  app.use('/collections', collectionsRoutes);
  app.use('/reviews', reviewsRoutes);
  app.use('/namespaces', namespaceRoutes);
  app.use('/discounts', discountRoutes);
  app.use('/orders', orderRoutes);
  app.use('/promo-codes', promoCodeRoutes);

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

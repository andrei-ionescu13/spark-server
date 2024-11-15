import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { articleCategoryRoutes } from './article-category/index';
import { articleTagRoutes } from './article-tag/index';
import { articlesRoutes } from './article/index';
import { authRoutes } from './auth/index';
import { collectionsRoutes } from './collection/index';
import { promoCodeRoutes } from './coupon/index';
import { currencyRoutes } from './currency/index';
import { dealsRoutes } from './deals/index';
import { developerRoutes } from './developer';
import { discountRoutes } from './discount/index';
import { featureRoutes } from './feature';
import { genreRoutes } from './genre/index';
import { keysRoutes } from './key/index';
import { languageRoutes } from './language/index';
import { verifyToken } from './middleware/verify-token';
import { namespaceRoutes } from './namespace/index';
import { operatingSystemRoutes } from './operating-system';
import { orderRoutes } from './orders/index';
import { platformRoutes } from './platform/index';
import { productRoutes } from './product/index';
import { publisherRoutes } from './publisher/index';
import { reviewsRoutes } from './review/index';
import { translationsLanguageRoutes } from './translations-language/index';
import { userRoutes } from './users/index';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const run = async () => {
  mongoose.connect(process.env.MONGO_URI as string);
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

  app.use('/languages', languageRoutes);
  app.use('/articles', articlesRoutes);
  app.use('/operating-systems', operatingSystemRoutes);
  app.use('/developers', developerRoutes);
  app.use('/features', featureRoutes);
  app.use('/article-categories', articleCategoryRoutes);
  app.use('/article-tags', articleTagRoutes);
  app.use('/publishers', publisherRoutes);
  app.use('/platforms', platformRoutes);
  app.use('/currencies', currencyRoutes);
  app.use('/genres', genreRoutes);
  app.use('/translations/languages', translationsLanguageRoutes);
  app.use('/translations/namespaces', namespaceRoutes);
  app.use('/products', productRoutes);
  app.use('/users', userRoutes);
  app.use('/keys', keysRoutes);
  app.use('/collections', collectionsRoutes);
  app.use('/deals', dealsRoutes);
  app.use('/reviews', reviewsRoutes);
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

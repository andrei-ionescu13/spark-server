'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateDeal = void 0;
const queries_1 = require('../modules/product/repo/queries');
const commands_1 = require('../modules/deals/repo/commands');
const assets_1 = require('../assets');
const uploaderService_1 = require('../services/uploaderService');
const meta_1 = require('../meta');
const deal_1 = require('../modules/deals/domain/deal');
const dealDescription_1 = require('../modules/deals/domain/dealDescription');
const dealTitle_1 = require('../modules/deals/domain/dealTitle');
const generateDeal = async () => {
  const productQueriesRepo = new queries_1.ProductQueriesRepo();
  const dealCommandsRepo = new commands_1.DealCommandsRepo();
  const products = await productQueriesRepo.listAllProducts();
  const productIds = products.map((product) => product._id);
  const uploaderService = new uploaderService_1.CloudinaryUploaderService();
  const uploadedCover = await uploaderService.uploadFromUrl(
    `https://fanatical.imgix.net/product/original/a91dab37-38d9-4d37-aebe-5daf8fde0ca8.jpeg`,
    'deals',
  );
  const cover = assets_1.Asset.create(uploadedCover).value;
  const description = dealDescription_1.DealDescription.create('description').value;
  const meta = meta_1.Meta.create({
    description: 'deal',
    keywords: ['games'],
    title: 'Deal',
  }).value;
  const title = dealTitle_1.DealTitle.create('Summer Deals').value;
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 5);
  const now = new Date();
  const props = {
    cover,
    description,
    endDate,
    meta,
    products: productIds,
    slug: 'summer-deals',
    startDate: now,
    title,
  };
  const deal = deal_1.Deal.create(props).value;
  await dealCommandsRepo.save(deal);
};
exports.generateDeal = generateDeal;

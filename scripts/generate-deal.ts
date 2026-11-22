import { ProductQueriesRepo } from '../src/modules/product/repo/queries';
import { DealCommandsRepo } from '../src/modules/deals/repo/commands';
import { Asset } from '../src/assets';
import { CloudinaryUploaderService } from '../src/services/uploaderService';
import { Meta } from '../src/meta';
import { CreateDealProps, Deal } from '../src/modules/deals/domain/deal';
import { DealDescription } from '../src/modules/deals/domain/dealDescription';
import { DealTitle } from '../src/modules/deals/domain/dealTitle';

export const generateDeal = async () => {
  const productQueriesRepo = new ProductQueriesRepo();
  const dealCommandsRepo = new DealCommandsRepo();
  const products = await productQueriesRepo.listAllProducts();
  const productIds = products.map((product) => product._id);
  const uploaderService = new CloudinaryUploaderService();
  const uploadedCover = await uploaderService.uploadFromUrl(
    `https://fanatical.imgix.net/product/original/a91dab37-38d9-4d37-aebe-5daf8fde0ca8.jpeg`,
    'deals',
  );
  const cover = Asset.create(uploadedCover).value;

  const description = DealDescription.create('description').value;
  const meta = Meta.create({
    description: 'deal',
    keywords: ['games'],
    title: 'Deal',
  }).value;
  const title = DealTitle.create('Summer Deals').value;
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 5);
  const now = new Date();
  const props: CreateDealProps = {
    cover,
    description,
    endDate,
    meta,
    products: productIds,
    slug: 'summer-deals',
    startDate: now,
    title,
  };

  const deal = Deal.create(props).value;
  await dealCommandsRepo.save(deal);
};

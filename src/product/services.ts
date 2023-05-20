import { productDb } from './index';
import { keyDb, KeyModel, keyServices } from '../key/index';
import { NotFoundError } from '../errors';
// import { collectionRepo } from '../collection/index';
import { discountDb } from '../discount/index';
import { promoCodeDb } from '../coupon/index';

const calculateRating = async (id) => {
  const product = await productDb.getProduct(id);

  if (!product) {
    throw new NotFoundError('product not found');
  }

  const reviews = await productDb.listProductReviews(id);

  const rating: any = {};
  rating.distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((review) => {
    rating.distribution[review.rating] += 1;
  });

  const publishedReviews = reviews.filter((review) => review.status === 'published');
  rating.average = publishedReviews.length
    ? (
        publishedReviews.reduce((acc, review) => acc + review.rating, 0) / publishedReviews.length
      ).toFixed(2)
    : 0;

  await productDb.updateProduct(product._id, { rating });
};

// const createProduct = async (props, coverFile, imageFiles, keysFile) => {
//   const uploadedCover = await uploader.uploadFile(coverFile, 'products');
//   const uploadedImages = await Promise.all(
//     imageFiles.map(async (image) => ({
//       ...(await uploader.uploadFile(image, 'products')),
//       originalname: image.originalname,
//     })),
//   );

//   props.cover = uploadedCover;
//   props.images = uploadedImages.map((image) => {
//     const { originalname, ...rest } = image;
//     return rest;
//   });

//   props.selectedImages = uploadedImages
//     .filter((image) => props.selectedImages.includes(image.originalname))
//     .map((image) => {
//       const { originalname, ...rest } = image;
//       return rest;
//     });

//   const product = await productDb.createProduct(props);

//   const keys = keysFile.buffer
//     .toString()
//     .split('\n')
//     .map((key) => key.trim());
//   await Promise.all(keys.map((key) => keyServices.createKey(product._id, key)));

//   return product;
// };

// const getProduct = async (id) => {
//   const product = await productDb.getProduct(id);
//   return product;
// };

// const deleteProduct = async (id) => {
//   const product = await productDb.getProduct(id);
//   if (!product) {
//     throw new NotFoundError('product not found');
//   }

//   await Promise.all(product.reviews.map((review) => reviewServices.deleteReview(review)));
//   await Promise.all(product.keys.map((key) => keyServices.deleteKey(key)));
//   await uploader.delete(product.cover.public_id);
//   await Promise.all(product.images.map((image) => uploader.delete(image.public_id)));
//   await productDb.deleteProduct(id);
//   await collectionRepo.removeProductFromCollections(product._id);
//   await discountDb.removeProductFromDiscounts(product._id);
//   await promoCodeDb.removeProductFromPromoCodes(product._id);
// };

// const searchProducts = async (query) => {
//   const products = await productDb.searchProducts(query);
//   const count = await productDb.getProductsCount(query);

//   return {
//     products,
//     count,
//   };
// };

// const updateProduct = async (id, props) => {
//   const product = await productDb.getProduct(id);

//   if (!product) {
//     throw new NotFoundError('product not found');
//   }

//   if (product.status === 'archived') {
//     return res.status(400).send({ message: `can't update an archived product` });
//   }

//   const updatedProduct = await productDb.updateProduct(id, props);
//   return updatedProduct;
// };

// const importProductKeys = async (id, keysFile) => {
//   const product = await productDb.getProduct(id);

//   if (!product) {
//     throw new NotFoundError('product not found');
//   }

//   if (product.status === 'archived') {
//     return res.status(400).send({ message: `can't add keys to an archived product` });
//   }

//   const promises = keysFile.buffer
//     .toString()
//     .split('\n')
//     .map(async (keyValue) => {
//       const key = await keyDb.createKey({
//         product: id,
//         value: keyValue,
//       });
//       await productDb.addProductKey(id, key);
//     });

//   await Promise.all(promises);
// };

// const updateProductMedia = async (id, body, coverFile, imageFiles) => {
//   let { cover, images, selectedImages, ...props } = body;

//   const product = await productDb.getProduct(id);

//   if (!product) {
//     throw new NotFoundError('product not found');
//   }

//   if (coverFile) {
//     await uploader.delete(product.cover.public_id);
//     const uploadedCover = await uploader.uploadFile(coverFile, 'products');
//     props.cover = uploadedCover;
//   }

//   const filesToDelete = product.images.filter(
//     (productImage) => !images.includes(productImage.public_id),
//   );
//   await Promise.all(filesToDelete.map((file) => uploader.delete(file.public_id)));

//   images = product.images.filter((productImage) => images.includes(productImage.public_id));

//   if (imageFiles) {
//     const imagesUploadRes = await Promise.all(
//       imageFiles.map(async (image) => ({
//         ...(await uploader.uploadFile(image, 'products')),
//         originalname: image.originalname,
//       })),
//     );

//     imagesUploadRes.forEach((x) => images.push(x));
//   }
//   props.selectedImages = images.filter(
//     (image) =>
//       selectedImages.includes(image.public_id) || selectedImages.includes(image.originalname),
//   );

//   const updatedProduct = await productDb.updateProduct(id, { ...props, images });
//   return updatedProduct;
// };

// const updateProductStatus = async (id, status) => {
//   const product = await productDb.getProduct(id);

//   if (!product) {
//     throw new NotFoundError('product not found');
//   }

//   const updatedProduct = await productDb.updateProduct(id, { status });
//   return updatedProduct;
// };

// const searchProductReviews = async (id, query) => {
//   const reviews = await productDb.searchProductReviews(id, query);
//   const count = await productDb.getProductReviewsCount(id, query);

//   return { reviews, count };
// };

const deleteReview = async (id, reviewId) => {
  const product = await productDb.getProduct(id);

  if (!product) {
    throw new NotFoundError('product not found');
  }

  await productDb.deleteReview(id, reviewId);
  await calculateRating(id);
};

export const productServices = {
  // createProduct,
  // getProduct,
  // deleteProduct,
  // searchProducts,
  // updateProduct,
  // updateProductMedia,
  // updateProductStatus,
  // importProductKeys,
  // searchProductReviews,
  // deleteReview,
  calculateRating,
};

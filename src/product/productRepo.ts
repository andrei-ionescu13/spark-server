import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Product } from './model';

export interface ProductRepoI {
  createProduct: any;
  getProduct: any;
  getProducts: any;
  getProductByKey: any;
  deleteProduct: any;
  deleteMultipleProducts: any;
  listProducts: any;
  updateProduct: any;
  searchProducts: any;
  getProductsCount: any;
  searchProductKeys: any;
  deleteProductsGenre: any;
  deleteProductKey: any;
  addProductKey: any;
  searchProductReviews: any;
  getProductReviewsCount: any;
  listProductReviews: any;
  deleteReview: any;
  getProductByProps: any;

  searchProductsByKeys: any;
  deleteDeveloper: any;
  deleteFeature: any;
  getProductByPublisher: any;
  deleteProductsOperatingSystem: any;
}

export class ProductRepo implements ProductRepoI {
  constructor(private productModel: Model<Product>) {}

  createProduct = (props) => this.productModel.create(props);

  getProduct = (id) =>
    this.productModel
      .findOne({ _id: id })
      .populate('genres publisher platform discount developers features os languages')
      .exec();

  getProductByProps = (props: Array<Record<string, any>>) =>
    this.productModel.findOne({ $or: props }).lean();

  getProducts = (ids) =>
    this.productModel
      .find({ _id: { $in: ids } })
      .populate('discount')
      .exec();

  getProductByKey = (keyId) => this.productModel.findOne({ keys: keyId }).exec();

  deleteProduct = (id) => this.productModel.deleteOne({ _id: id });

  deleteMultipleProducts = (ids) => this.productModel.deleteMany({ _id: { $in: ids } });

  getProductByPublisher = (publisherId) => this.productModel.findOne({ publisher: publisherId });

  searchProductsByKeys = (keyValue) =>
    this.productModel.aggregate([
      {
        $unwind: '$keys',
      },
      {
        $lookup: {
          from: 'keys',
          localField: 'keys',
          foreignField: '_id',
          as: 'keys',
        },
      },
      {
        $match: {
          'keys.value': keyValue,
        },
      },
      {
        $lookup: {
          from: 'platforms',
          localField: 'platform',
          foreignField: '_id',
          as: 'platform',
        },
      },
      {
        $addFields: {
          platform: {
            $arrayElemAt: ['$platform', 0],
          },
        },
      },
    ]);

  listProducts = () =>
    this.productModel.aggregate([
      {
        $lookup: {
          from: 'keys',
          localField: '_id',
          foreignField: 'product',
          as: 'keys',
        },
      },
      {
        $project: {
          _id: 1,
          'keys.value': 1,
          'keys.status': 1,
        },
      },
    ]);

  updateProduct = (id, props) =>
    this.productModel
      .findOneAndUpdate({ _id: id }, { $set: props }, { new: true })
      .populate('genres publisher platform')
      .exec();

  searchProducts = (query) => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      page = 0,
      limit = 10,
    } = query;

    return this.productModel
      .find({
        title: {
          $regex: keyword,
          $options: 'i',
        },
        ...(status && {
          status,
        }),
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip(page * limit)
      .limit(limit)
      .exec();
  };

  getProductsCount = (query) => {
    const { status } = query;

    return this.productModel
      .find({
        ...(status && {
          status,
        }),
      })
      .count();
  };

  searchProductKeys = async (id, query) => {
    let { keyword = '', status, page = 0, limit = 10 } = query;

    const result = await this.productModel
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: 'keys',
            localField: '_id',
            foreignField: 'product',
            as: 'keys',
          },
        },
        { $unwind: '$keys' },
        {
          $match: {
            'keys.value': {
              $regex: keyword,
              $options: 'i',
            },
            ...(status && {
              'keys.status': status,
            }),
          },
        },
        {
          $sort: {
            'keys.createdAt': 1,
          },
        },
        {
          $facet: {
            count: [{ $count: 'count' }],
            keys: [
              { $skip: page * limit },
              { $limit: limit },
              {
                $group: {
                  _id: '$_id',
                  keys: {
                    $push: '$keys',
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            count: {
              $arrayElemAt: ['$count', 0],
            },
            keys: {
              $arrayElemAt: ['$keys', 0],
            },
          },
        },
        {
          $project: {
            count: '$count.count',
            keys: '$keys.keys',
          },
        },
      ])
      .exec();

    return {
      count: result[0].count,
      keys: result[0]?.keys || [],
    };
  };

  deleteProductsGenre = (genreId) =>
    this.productModel.updateMany({ genres: genreId }, { $pull: { genres: genreId } });

  deleteProductKey = (productId, keyId) => {
    return this.productModel.updateOne(
      { _id: new ObjectId(productId) },
      {
        $pull: {
          keys: new ObjectId(keyId),
        },
      },
    );
  };

  addProductKey = (productId, keyId) => {
    return this.productModel.updateOne(
      { _id: productId },
      {
        $push: {
          keys: keyId,
        },
      },
    );
  };
  // getProductsCount = ({ keyword = '', status, tag }) => this.productModel
  //   .find({
  //     title: {
  //       $regex: keyword,
  //       $options: 'i'
  //     },
  //     ...status && ({
  //       status
  //     }),
  //     ...tag && ({
  //       tag
  //     }),
  //   })
  //   .count()

  // duplicateProduct = async (id) => {
  //   const article = await this.getProduct(id);
  //   let { _id, ...articleProps } = article._doc;
  //   articleProps.status = 'draft';
  //   const newProduct = await this.createProduct(articleProps)
  //   return newProduct
  // }

  deleteDeveloper = (developerId) =>
    this.productModel.updateMany(
      { developers: developerId },
      { $pull: { developers: developerId } },
    );

  deleteFeature = (featureId) =>
    this.productModel.updateMany({ features: featureId }, { $pull: { features: featureId } });

  deleteProductsOperatingSystem = (operatingSystemId) =>
    this.productModel.updateMany(
      { operatingSystems: operatingSystemId },
      { $pull: { operatingSystems: operatingSystemId } },
    );

  searchProductReviews = async (id, query) => {
    const { keyword = '', status, sortOrder = 'desc', page = 0, limit = 10 } = query;
    let { sortBy = 'createdAt' } = query;

    if (sortBy === 'user') {
      sortBy = 'user.email';
    }

    const result = await this.productModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
          reviews: '$reviews',
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews',
        },
      },
      { $unwind: '$reviews' },
      { $replaceRoot: { newRoot: '$reviews' } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $set: {
          user: { $arrayElemAt: ['$user', 0] },
        },
      },
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  'user.email': {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
              ],
            },
            {
              ...(status && {
                status,
              }),
            },
          ],
        },
      },
      { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
      {
        $facet: {
          count: [{ $count: 'count' }],
          reviews: [{ $skip: page * limit }, { $limit: limit }],
        },
      },
      {
        $addFields: {
          count: {
            $arrayElemAt: ['$count', 0],
          },
          reviews: '$reviews',
        },
      },
      {
        $project: {
          count: '$count.count',
          reviews: '$reviews',
        },
      },
    ]);

    return {
      count: result[0].count || 0,
      reviews: result[0]?.reviews || [],
    };
  };

  getProductReviewsCount = async (id, query) => {
    const { keyword = '', status } = query;
    let { sortBy = 'createdAt' } = query;

    if (sortBy === 'user') {
      sortBy = 'user.email';
    }

    const result = await this.productModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
          reviews: '$reviews',
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews',
        },
      },
      { $unwind: '$reviews' },
      { $replaceRoot: { newRoot: '$reviews' } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $set: {
          user: { $arrayElemAt: ['$user', 0] },
        },
      },
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  'user.email': {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
              ],
            },
            {
              ...(status && {
                status,
              }),
            },
          ],
        },
      },
      { $count: 'count' },
    ]);

    return result[0]?.count || 0;
  };

  listProductReviews = async (id) => {
    const result = await this.productModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
          reviews: '$reviews',
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews',
        },
      },
      { $unwind: '$reviews' },
      { $replaceRoot: { newRoot: '$reviews' } },
    ]);

    return result;
  };

  deleteReview = (id, reviewId) =>
    this.productModel
      .findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            reviews: reviewId,
          },
        },
        {
          new: true,
        },
      )
      .exec();
}

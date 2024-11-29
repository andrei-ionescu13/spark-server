import { Model } from 'mongoose';
import { Key } from './model';

export interface KeyRepoI {
  createKey: any;
  getKey: any;
  deleteKey: any;
  updateKey: any;
  searchKeys: any;
  getKeysCount: any;
  getKeyByValue: any;
}

export class KeyRepo implements KeyRepoI {
  constructor(private keyModel: Model<Key>) {}

  createKey = (props) => this.keyModel.create(props);

  getKey = (id) => this.keyModel.findOne({ _id: id }).exec();

  getKeyByValue = (value) => this.keyModel.findOne({ value }).exec();

  deleteKey = (id) => this.keyModel.deleteOne({ _id: id });

  // deleteMultipleKeys = (ids) => this.keyModel.deleteMany({ _id: { $in: ids } });

  // // listKeys = (ids) => this.keyModel.find({ _id: { $in: ids } });

  updateKey = (id, props) =>
    this.keyModel.findOneAndUpdate({ _id: id }, { $set: props }, { new: true }).exec();

  searchKeys = async (query) => {
    const { keyword = '', status, page = 1, limit = 10 } = query;

    const result = await this.keyModel
      .aggregate([
        {
          $match: {
            value: {
              $regex: keyword,
              $options: 'i',
            },
            ...(status && {
              status: status,
            }),
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
        {
          $facet: {
            count: [{ $count: 'count' }],
            keys: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              {
                $lookup: {
                  from: 'products',
                  localField: 'product',
                  foreignField: '_id',
                  as: 'product',
                },
              },
              { $unwind: '$product' },
            ],
          },
        },
        {
          $addFields: {
            count: {
              $arrayElemAt: ['$count', 0],
            },
          },
        },
        {
          $project: {
            count: '$count.count',
            keys: '$keys',
          },
        },
      ])
      .exec();

    return {
      count: result[0].count,
      keys: result[0]?.keys || [],
    };
  };

  getKeysCount = (query) => {
    const { keyword = '', status } = query;

    return this.keyModel
      .find({
        value: {
          $regex: keyword,
          $options: 'i',
        },
        ...(status && {
          status,
        }),
      })
      .count();
  };

  // searchKeyKeys = async (id, query = {}) => {
  //   const { keyword = '', status, page, perPage } = query;

  //   const result = await this.keyModel
  //     .aggregate([
  //       { $match: { _id: ObjectId(id) } },
  //       { $unwind: '$keys' },
  //       {
  //         $sort: {
  //           'keys.createdAt': 1
  //         }
  //       },
  //       {
  //         '$facet': {
  //           count: [
  //             { '$count': 'count' },
  //           ],
  //           keys: [
  //             {
  //               $match: {
  //                 'keys.value': {
  //                   $regex: keyword,
  //                   $options: 'i'
  //                 },
  //                 ...status && ({
  //                   'keys.status': status
  //                 })
  //               }
  //             },
  //             {
  //               $group: {
  //                 _id: '$_id',
  //                 keys: {
  //                   $push: '$keys'
  //                 }
  //               }
  //             }
  //           ]
  //         }
  //       },
  //       {
  //         $addFields: {
  //           "count": {
  //             $arrayElemAt: ["$count", 0]
  //           },
  //           "keys": {
  //             $arrayElemAt: ["$keys", 0]
  //           },
  //         }
  //       },
  //       {
  //         $project: {
  //           count: "$count.count",
  //           keys: "$keys.keys",
  //         }
  //       }
  //     ]).exec();

  //   return {
  //     count: result[0].count,
  //     keys: result[0]?.keys || []
  //   }
  // }

  // deleteKeyKey = (keyId, keyId) => {
  //   return this.keyModel.updateOne({ _id: ObjectId(keyId) }, {
  //     $pull: {
  //       keys: {
  //         _id: ObjectId(keyId)
  //       },
  //     },
  //   });
  // }

  // addKeyKey = (keyId, key) => {
  //   return this.keyModel.updateOne({ _id: ObjectId(keyId) }, {
  //     $push: {
  //       keys: new keyModel({ value: key })
  //     },
  //   });
  // }
  // getKeysCount = ({ keyword = '', status, tag }) => this.keyModel
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

  // duplicateKey = async (id) => {
  //   const article = await this.getKey(id);
  //   let { _id, ...articleProps } = article._doc;
  //   articleProps.status = 'draft';
  //   const newKey = await this.createKey(articleProps)
  //   return newKey
  // }
}

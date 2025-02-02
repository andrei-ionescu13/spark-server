import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Namespace } from './model';

export interface NamespaceRepoI {
  getKey: any;
  getNamespace: any;
  getNamespaceByName: any;
  listNamespaces: any;
  createNamespace: any;
  deleteNamespace: any;
  addNamespaceTranslation: any;
  deleteNamespaceTranslation: any;
  deleteTranslations: any;
  updateNamespaceTranslation: any;
  updateNamespace: any;
  searchNamespaces: any;
  getNamespacesCount: any;
  searchTranslations: any;
  searchNamespaceTranslations: any;
}

export class NamespaceRepo implements NamespaceRepoI {
  constructor(private namespaceModel: Model<Namespace>) {}

  getKey = (id) => this.namespaceModel.findOne({ _id: id }).exec();

  getNamespaceByName = (name: string) => this.namespaceModel.findOne({ name }).exec();

  getNamespace = (id, props = {}) => this.namespaceModel.findOne({ _id: id, ...props }).exec();

  listNamespaces = () => this.namespaceModel.find({});

  createNamespace = (props) => this.namespaceModel.create(props);

  deleteNamespace = (id) => this.namespaceModel.deleteOne({ _id: id });

  addNamespaceTranslation = (id, props) =>
    this.namespaceModel
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          updatedAt: Date.now(),
          $push: {
            translations: props,
          },
        },
        {
          new: true,
        },
      )
      .exec();

  deleteNamespaceTranslation = (id, translationKey) =>
    this.namespaceModel
      .findOneAndUpdate(
        {
          _id: id,
          'translations.key': translationKey,
        },
        {
          updatedAt: Date.now(),
          $pull: {
            translations: {
              key: translationKey,
            },
          },
        },
        {
          new: true,
        },
      )
      .exec();

  deleteTranslations = (translationsLanguageCode) =>
    this.namespaceModel.updateOne(
      {},
      { $unset: { [`translations.$[].${translationsLanguageCode}`]: 1 } },
      { multi: true },
    );

  updateNamespaceTranslation = (id, translationKey, props) => {
    const mappedProps = {};
    Object.keys(props).map((key) => {
      mappedProps[`translations.$.${key}`] = props[key];
    });

    return this.namespaceModel
      .findOneAndUpdate(
        {
          _id: id,
          'translations.key': translationKey,
        },
        {
          updatedAt: Date.now(),
          $set: mappedProps,
        },
        {
          new: true,
        },
      )
      .exec();
  };

  updateNamespace = (id, props) =>
    this.namespaceModel.findOneAndUpdate({ _id: id }, { $set: props }, { new: true }).exec();

  searchNamespaces = (query) => {
    const { keyword = '', page, limit, sortBy = 'name', sortOrder = 'asc' } = query;

    return this.namespaceModel
      .find({
        name: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  };

  getNamespacesCount = (query) => {
    const { keyword = '' } = query;

    return this.namespaceModel
      .find({
        name: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .count();
  };

  searchTranslations = async (query, translationsLanguageCodes = []) => {
    const { keyword = '', page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = query;
    const orQuery = translationsLanguageCodes.map((code) => ({
      [`translations.${code}`]: {
        $regex: keyword,
        $options: 'i',
      },
    }));

    return (
      await this.namespaceModel
        .aggregate([
          {
            $match: {
              $or: [
                {
                  name: {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
                {
                  'translations.key': {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
                ...orQuery,
              ],
            },
          },
          {
            $unwind: {
              path: '$translations',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              $or: [
                {
                  name: {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
                {
                  'translations.key': {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
                ...orQuery,
              ],
            },
          },
          {
            $group: {
              _id: '$_id',
              name: { $first: '$name' },
              createdAt: { $first: '$createdAt' },
              updatedAt: { $first: '$updatedAt' },
              translations: {
                $push: '$translations',
              },
            },
          },
          {
            $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
          },
          {
            $facet: {
              namespaces: [{ $skip: (page - 1) * limit }, { $limit: limit }],
              count: [{ $count: 'count' }],
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
              namespaces: 1,
            },
          },
        ])
        .exec()
    )[0];
  };

  searchNamespaceTranslations = async (id, query, translationsLanguageCodes = []) => {
    const { keyword = '', page, perPage, sortBy = 'key', sortOrder = 'asc' } = query;

    const orQuery = translationsLanguageCodes.map((code) => ({
      [`translations.${code}`]: {
        $regex: keyword,
        $options: 'i',
      },
    }));

    const result = await this.namespaceModel
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $facet: {
            data: [
              {
                $project: {
                  name: '$name',
                },
              },
            ],
            translations: [
              { $unwind: '$translations' },
              {
                $match: {
                  $or: [
                    {
                      'translations.key': {
                        $regex: keyword,
                        $options: 'i',
                      },
                    },
                    ...orQuery,
                  ],
                },
              },
              {
                $sort: {
                  [`translations.${sortBy}`]: sortOrder === 'asc' ? 1 : -1,
                },
              },
              {
                $group: {
                  count: { $sum: 1 },
                  _id: '$_id',
                  translations: {
                    $push: '$translations',
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            data: {
              $arrayElemAt: ['$data', 0],
            },
            translations: {
              $arrayElemAt: ['$translations', 0],
            },
          },
        },
        {
          $project: {
            name: '$data.name',
            _id: '$data._id',
            count: '$translations.count',
            translations: '$translations.translations',
          },
        },
        {
          $project: {
            name: 1,
            _id: 1,
            count: { $ifNull: ['$count', 0] },
            translations: { $ifNull: ['$translations', []] },
          },
        },
      ])
      .exec();

    return result[0];
  };
}

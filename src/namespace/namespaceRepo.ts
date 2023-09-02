import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Namespace } from './model';

export interface NamespaceRepoI {
  getKey: any;
  getNamespace: any;
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

  searchNamespaces = (query, translationsLanguageCodes = []) => {
    const { keyword = '', page, perPage: limit, sortBy = 'name', sortOrder = 'asc' } = query;

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
      .skip(page * limit)
      .limit(limit)
      .exec();
  };

  getNamespacesCount = (query, translationsLanguageCodes = []) => {
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
    const { keyword = '', page, perPage, sortBy = 'name', sortOrder = 'asc' } = query;
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
            },
          },
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
              namespaces: [{ $match: {} }],
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

  searchNamespaceTranslations = (id, query, translationsLanguageCodes = []) => {
    const { keyword = '', page, perPage, sortBy = 'key', sortOrder = 'asc' } = query;

    const orQuery = translationsLanguageCodes.map((code) => ({
      [`translations.${code}`]: {
        $regex: keyword,
        $options: 'i',
      },
    }));

    return this.namespaceModel
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
            translations: '$translations.translations',
          },
        },
      ])
      .exec();
  };
}

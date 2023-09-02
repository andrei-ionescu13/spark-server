import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Genre } from './model';

export interface GenreRepoI {
  createGenre: any;
  getGenre: any;
  deleteGenre: any;
  deleteMultipleGenres: any;
  listGenres: any;
  updateGenre: any;
  searchGenres: any;
  getGenresCount: any;
  getGenres: any;
}

export class GenreRepo implements GenreRepoI {
  constructor(private genreModel: Model<Genre>) {}

  createGenre = (props) => this.genreModel.create(props);

  getGenre = (id) => this.genreModel.findOne({ _id: new ObjectId(id) }).exec();

  getGenres = (ids) => this.genreModel.find({ _id: { $in: ids } });

  deleteGenre = (id) => this.genreModel.deleteOne({ _id: id });

  deleteMultipleGenres = (ids) => this.genreModel.deleteMany({ _id: { $in: ids } });

  listGenres = () => this.genreModel.find({});

  updateGenre = (id, props) =>
    this.genreModel.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: props }, { new: true });

  searchGenres = (query) => {
    console.log('db', query);
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'asc', page, limit } = query;
    return this.genreModel
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

  getGenresCount = (query) => {
    const { keyword = '' } = query;

    return this.genreModel
      .find({
        title: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .count();
  };
}

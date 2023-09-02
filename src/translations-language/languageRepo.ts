import { Model } from 'mongoose';
import { TranslationsLanguage } from './model';
import { ObjectId } from 'mongodb';

export interface TranslationsLanguageRepoI {
  getTranslationsLanguage: any;
  getTranslationsLanguageByCode: any;
  listTranslationsLanguages: any;
  createTranslationsLanguage: any;
  deleteTranslationsLanguage: any;
}

export class TranslationsLanguageRepo implements TranslationsLanguageRepoI {
  constructor(private translationsLanguageModel: Model<TranslationsLanguage>) {}

  getTranslationsLanguage = (id) => this.translationsLanguageModel.findOne({ _id: id }).exec();

  getTranslationsLanguageByCode = (code) => this.translationsLanguageModel.findOne({ code }).exec();

  listTranslationsLanguages = () => this.translationsLanguageModel.find({});

  createTranslationsLanguage = (props) =>
    this.translationsLanguageModel.create({ ...props, _id: new ObjectId(props._id) });

  deleteTranslationsLanguage = (id) => this.translationsLanguageModel.deleteOne({ _id: id });
}

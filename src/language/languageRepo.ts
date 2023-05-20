import { Model } from 'mongoose';
import { Language } from './model';

export interface LanguageRepoI {
  getLanguage: any;
  getLanguageByCode: any;
  listLanguages: any;
  createLanguage: any;
  deleteLanguage: any;
}

export class LanguageRepo implements LanguageRepoI {
  constructor(private languageModel: Model<Language>) {}

  getLanguage = (id) => this.languageModel.findOne({ _id: id }).exec();

  getLanguageByCode = (code) => this.languageModel.findOne({ code }).exec();

  listLanguages = () => this.languageModel.find({});

  createLanguage = (props) => this.languageModel.create(props);

  deleteLanguage = (id) => this.languageModel.deleteOne({ _id: id });
}

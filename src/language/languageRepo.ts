import { Model } from 'mongoose';
import { Language } from './model';

export interface LanguageRepoI {
  listLanguages: any;
  getLanguages: any;
}

export class LanguageRepo implements LanguageRepoI {
  constructor(private languageModel: Model<Language>) {}

  listLanguages = () => this.languageModel.find({});

  getLanguages = (ids) => this.languageModel.find({ _id: { $in: ids } });
}

import { Collection } from 'mongodb';
import { Language } from '../domain/language';
import { LanguageMapper } from '../languageMapper';
import { LanguageDoc } from '../model';
import { Mongo } from '../../../../mongo';

export interface LanguageCommandsRepoI {
  save: (language: Language) => Promise<void>;
  deleteLanguage: (id: string) => Promise<void>;
}

export class LanguageCommandsRepo implements LanguageCommandsRepoI {
  collection = Mongo.getCollection<LanguageDoc>('languages');

  save = async (language: Language): Promise<void> => {
    const persistence = LanguageMapper.toPersistance(language);
    console.log(persistence);
    await this.collection.updateOne({ _id: language._id }, { $set: persistence }, { upsert: true });
  };

  deleteLanguage = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}

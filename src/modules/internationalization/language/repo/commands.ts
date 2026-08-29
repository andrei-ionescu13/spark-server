import { Collection } from 'mongodb';
import { Language } from '../language';
import { LanguageMapper } from '../languageMapper';
import { LanguageDoc } from '../model';

export interface LanguageCommandsRepoI {
  save: (language: Language) => Promise<void>;
  deleteLanguage: (id: string) => Promise<void>;
}

export class LanguageCommandsRepo implements LanguageCommandsRepoI {
  constructor(private collection: Collection<LanguageDoc>) {}

  save = async (language: Language): Promise<void> => {
    const persistence = LanguageMapper.toPersistance(language);

    await this.collection.updateOne({ _id: language._id }, { $set: persistence }, { upsert: true });
  };

  deleteLanguage = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}

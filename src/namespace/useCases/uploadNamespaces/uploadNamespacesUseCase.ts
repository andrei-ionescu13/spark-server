import fs from 'fs';
import { join } from 'path';
import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { TranslationServiceI } from '../../../services/translationService';
import { UploaderService } from '../../../services/uploaderService';
import { TranslationsLanguageRepoI } from '../../../translations-language/languageRepo';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { UploadNamespacesRequestDto } from './uploadNamespacesRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class UploadNamespacesUseCase implements UseCase<UploadNamespacesRequestDto, Response> {
  constructor(
    private namespaceRepo: NamespaceRepoI,
    private translationsLanguageRepo: TranslationsLanguageRepoI,
    private translationService: TranslationServiceI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UploadNamespacesRequestDto): Promise<Response> => {
    try {
      const languages = await this.translationsLanguageRepo.listTranslationsLanguages();
      const namespaces = await this.namespaceRepo.listNamespaces();
      const languagesCodes = languages.map((language) => language.code);

      const rootDirectory = join(process.cwd(), '/', 'translations');

      fs.rmSync(rootDirectory, { recursive: true, force: true });
      fs.mkdirSync(rootDirectory);

      languagesCodes.forEach((code) => {
        const translations = this.translationService.convertNamespacesToJson(namespaces, code);
        //add translations to the directory
        fs.writeFileSync(join(rootDirectory, `${code}.json`), JSON.stringify(translations));
      });

      const deletePromises = languagesCodes.map((code) =>
        this.uploaderService.delete(`locales/${code}.json`),
      );

      const addPromises = languagesCodes.map((code) =>
        this.uploaderService.uploadFromUrl(
          join(rootDirectory, `${code}.json`),
          'locales',
          'raw',
          code,
        ),
      );
      await Promise.all(deletePromises);
      await Promise.all(addPromises);

      fs.rmSync(rootDirectory, { recursive: true, force: true });
      return right(Result.ok<any>({ status: 'ok' }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}

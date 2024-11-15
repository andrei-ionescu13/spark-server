import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { ExportNamespacesRequestDto } from './exportNamespacesRequestDto';
import { join } from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { TranslationsLanguageRepoI } from '../../../translations-language/languageRepo';
import { TranslationServiceI } from '../../../services/translationService';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ExportNamespacesUseCase implements UseCase<ExportNamespacesRequestDto, Response> {
  constructor(
    private namespaceRepo: NamespaceRepoI,
    private translationsLanguageRepo: TranslationsLanguageRepoI,
    private translationService: TranslationServiceI,
  ) { }

  execute = async (): Promise<Response> => {
    try {
      const languages = await this.translationsLanguageRepo.listTranslationsLanguages();
      const namespaces = await this.namespaceRepo.listNamespaces();
      const languagesCodes = languages.map(
        (language) => language.code,
      );

      //create directory
      const rootDirectory = join(process.cwd(), '/', 'translations');

      fs.rmSync(rootDirectory, { recursive: true, force: true });
      fs.mkdirSync(rootDirectory);

      languagesCodes.forEach((code) => {
        const translations = this.translationService.convertNamespacesToJson(namespaces, code);
        //add translations to the directory
        fs.writeFileSync(
          join(rootDirectory, `${code}.json`),
          JSON.stringify(translations),
        );
      });

      const zip = new AdmZip();
      const outputFile = 'translations.zip';
      //add the directory to the zip file
      await zip.addLocalFolderPromise(rootDirectory);
      await zip.writeZipPromise(join(process.cwd(), '/', outputFile));

      return right(
        Result.ok<any>({
          directoryPath: rootDirectory,
          filePath: join(process.cwd(), '/', outputFile),
        }),
      );
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}

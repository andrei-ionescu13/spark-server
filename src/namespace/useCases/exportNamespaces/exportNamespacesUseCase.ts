import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { ExportNamespacesRequestDto } from './exportNamespacesRequestDto';
import { join } from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { TranslationsLanguageRepoI } from '../../../translations-language/languageRepo';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ExportNamespacesUseCase implements UseCase<ExportNamespacesRequestDto, Response> {
  constructor(
    private namespaceRepo: NamespaceRepoI,
    private translationsLanguageRepo: TranslationsLanguageRepoI,
  ) {}

  execute = async (): Promise<Response> => {
    try {
      const translationsLanguages = await this.translationsLanguageRepo.listTranslationsLanguages();
      const namespaces = await this.namespaceRepo.listNamespaces();
      const translationsLanguagesCodes = translationsLanguages.map(
        (translationsLanguage) => translationsLanguage.code,
      );
      const rootDirectory = join(process.cwd(), '/', 'translations');

      fs.rmSync(rootDirectory, { recursive: true, force: true });
      fs.mkdirSync(rootDirectory);

      translationsLanguagesCodes.forEach((code) => {
        fs.mkdirSync(join(rootDirectory, code));
        namespaces.forEach((namespace) => {
          const namespacesName = namespace.name;
          const mappedTranslations = {};

          namespace.translations.forEach((translation) => {
            mappedTranslations[translation.key] = translation?.[code] || '';
          });

          fs.writeFileSync(
            join(rootDirectory, code, `${namespacesName}.json`),
            JSON.stringify(mappedTranslations),
          );
        });
      });
      const zip = new AdmZip();
      const outputFile = `${'translations'}.zip`;
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

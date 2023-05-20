import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { LanguageRepoI } from '../../../language/languageRepo';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { ExportNamespacesRequestDto } from './exportNamespacesRequestDto';
import { join } from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ExportNamespacesUseCase implements UseCase<ExportNamespacesRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI, private languageRepo: LanguageRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const languages = await this.languageRepo.listLanguages();
      const namespaces = await this.namespaceRepo.listNamespaces();
      const languagesCodes = languages.map((language) => language.code);
      const rootDirectory = join(process.cwd(), '/', 'translations');

      fs.rmSync(rootDirectory, { recursive: true, force: true });
      fs.mkdirSync(rootDirectory);

      languagesCodes.forEach((code) => {
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

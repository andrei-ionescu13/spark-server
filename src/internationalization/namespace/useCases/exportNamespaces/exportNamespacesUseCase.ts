import AdmZip from 'adm-zip';
import fs from 'fs';
import { join } from 'path';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { TranslationServiceI } from '../../../../services/translationService';
import { UseCase } from '../../../../use-case';
import { LanguageQueriesRepoI } from '../../../language/repo/queries';
import { NamespaceQueriesRepoI } from '../../repo/queries';
import { ExportNamespacesRequestDto } from './exportNamespacesRequestDto';

type Response = Result<{ directoryPath: string; filePath: string }, UseCaseErrors.UnexpectedError>;

//to do use archiver instead and stream the file
export class ExportNamespacesUseCase implements UseCase<ExportNamespacesRequestDto, Response> {
  constructor(
    private namespaceQueriesRepo: NamespaceQueriesRepoI,
    private languageQueriesRepoI: LanguageQueriesRepoI,
    private translationService: TranslationServiceI,
  ) {}

  execute = async (): Promise<Response> => {
    try {
      const languages = await this.languageQueriesRepoI.listLanguages();
      const namespaces = await this.namespaceQueriesRepo.listNamespaces();
      const languagesCodes = languages.map((language) => language.code);

      //create directory
      const rootDirectory = join(process.cwd(), '/', 'translations');

      fs.rmSync(rootDirectory, { recursive: true, force: true });
      fs.mkdirSync(rootDirectory);

      languagesCodes.forEach((code) => {
        const translations = this.translationService.convertNamespacesToJson(namespaces, code);
        //add translations to the directory
        fs.writeFileSync(join(rootDirectory, `${code}.json`), JSON.stringify(translations));
      });

      const zip = new AdmZip();
      const outputFile = 'translations.zip';
      //add the directory to the zip file
      await zip.addLocalFolderPromise(rootDirectory);
      await zip.writeZipPromise(join(process.cwd(), '/', outputFile));

      return Result.ok({
        directoryPath: rootDirectory,
        filePath: join(process.cwd(), '/', outputFile),
      });
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}

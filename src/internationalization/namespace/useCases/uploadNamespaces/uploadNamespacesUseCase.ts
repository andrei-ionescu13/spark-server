import fs from 'fs';
import { join } from 'path';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { TranslationServiceI } from '../../../../services/translationService';
import { UploaderService } from '../../../../services/uploaderService';
import { UseCase } from '../../../../use-case';
import { LanguageQueriesRepo } from '../../../language/repo/queries';
import { NamespaceQueriesRepoI } from '../../repo/queries';
import { UploadNamespacesRequestDto } from './uploadNamespacesRequestDto';

type Response = Result<undefined, UseCaseErrors.UnexpectedError>;

export class UploadNamespacesUseCase implements UseCase<UploadNamespacesRequestDto, Response> {
  constructor(
    private namespaceQueriesRepo: NamespaceQueriesRepoI,
    private languageQueriesRepo: LanguageQueriesRepo,
    private translationService: TranslationServiceI,
    private uploaderService: UploaderService,
  ) {}

  execute = async (request: UploadNamespacesRequestDto): Promise<Response> => {
    try {
      const languages = await this.languageQueriesRepo.listLanguages();
      const namespaces = await this.namespaceQueriesRepo.listNamespaces();
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
      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}

import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { LanguageQueriesRepoI } from '../../../language/repo/queries';
import { NamespaceQueriesRepoI } from '../../repo/queries';
import { SearchNamespacesRequestDto } from './searchNamespacesRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<any, UseCaseErrors.UnexpectedError>;

export class SearchNamespacesUseCase implements UseCase<SearchNamespacesRequestDto, Response> {
  constructor(
    private namespaceQueriesRepo: NamespaceQueriesRepoI,
    private languageQueriesRepo: LanguageQueriesRepoI,
  ) {}

  execute = async (request: SearchNamespacesRequestDto): Promise<Response> => {
    let query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      if (!query.languageCodes) {
        const languages = await this.languageQueriesRepo.listLanguages();
        query.languageCodes = languages.map((translationsLanguage) => translationsLanguage.code);
      }

      const result = await this.namespaceQueriesRepo.searchTranslations(query);
      return Result.ok(result);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}

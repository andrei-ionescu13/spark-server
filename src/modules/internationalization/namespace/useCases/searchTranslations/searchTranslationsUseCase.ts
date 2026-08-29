import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { LanguageQueriesRepoI } from '../../../language/repo/queries';
import { NamespaceQueriesRepoI } from '../../repo/queries';
import { SearchTranslationsRequestDto } from './searchTranslationsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type SearchNamespaceTranslationsResult = {
  name: string;
  _id: string;
  count: number;
  translations: Array<Record<string, string>>;
};

type Response = Result<SearchNamespaceTranslationsResult, UseCaseErrors.UnexpectedError>;

export class SearchTranslationsUseCase implements UseCase<SearchTranslationsRequestDto, Response> {
  constructor(
    private namespaceQueriesRepo: NamespaceQueriesRepoI,
    private languageQueriesRepoI: LanguageQueriesRepoI,
  ) {}

  execute = async (request: SearchTranslationsRequestDto): Promise<Response> => {
    let { namespaceId, ...rest } = request;
    const query = {
      ...rest,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      if (!query.languageCodes) {
        const translationsLanguages = await this.languageQueriesRepoI.listLanguages();
        query.languageCodes = translationsLanguages.map(
          (translationsLanguage) => translationsLanguage.code,
        );
      }

      const searchResult = await this.namespaceQueriesRepo.searchNamespaceTranslations(
        namespaceId,
        query,
      );

      return Result.ok(searchResult);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}

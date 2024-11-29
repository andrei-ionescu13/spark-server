import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { TranslationsLanguageRepoI } from '../../../translations-language/languageRepo';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { SearchNamespacesRequestDto } from './searchNamespacesRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchNamespacesUseCase implements UseCase<SearchNamespacesRequestDto, Response> {
  constructor(
    private namespaceRepo: NamespaceRepoI,
    private translationsLanguageRepo: TranslationsLanguageRepoI,
  ) {}

  execute = async (request: SearchNamespacesRequestDto): Promise<Response> => {
    let { translationsLanguageCodes, ...rest } = request;
    const query = rest;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      if (!translationsLanguageCodes) {
        const translationsLanguages =
          await this.translationsLanguageRepo.listTranslationsLanguages();
        translationsLanguageCodes = translationsLanguages.map(
          (translationsLanguage) => translationsLanguage.code,
        );
      } else {
        translationsLanguageCodes = translationsLanguageCodes.split(',');
      }

      const result = await this.namespaceRepo.searchTranslations(query, translationsLanguageCodes);
      return right(Result.ok<any>(result));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}

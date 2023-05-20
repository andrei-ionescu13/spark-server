import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { LanguageRepoI } from '../../../language/languageRepo';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { SearchNamespacesRequestDto } from './searchNamespacesRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 12;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchNamespacesUseCase implements UseCase<SearchNamespacesRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI, private languageRepo: LanguageRepoI) {}

  searchNamespaces = async (query, languageCodes) => {
    const namespaces = await this.namespaceRepo.searchNamespaces(query, languageCodes);
    const count = await this.namespaceRepo.getNamespacesCount(query, languageCodes);

    return {
      namespaces,
      count,
    };
  };

  execute = async (request: SearchNamespacesRequestDto): Promise<Response> => {
    let { searchFor = 'namespaces', languageCodes, ...rest } = request;
    const query = rest;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      if (!languageCodes) {
        const languages = await this.languageRepo.listLanguages();
        languageCodes = languages.map((language) => language.code);
      } else {
        languageCodes = languageCodes.split(',');
      }

      const promise =
        searchFor === 'translations'
          ? this.namespaceRepo.searchTranslations(query, languageCodes)
          : this.searchNamespaces(query, languageCodes);

      const result = await promise;
      console.log(result);
      return right(Result.ok<any>(result));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}

import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { LanguageRepoI } from '../../../language/languageRepo';
import { UseCase } from '../../../use-case';
import { NamespaceRepoI } from '../../namespaceRepo';
import { SearchTranslationsRequestDto } from './searchTranslationsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 12;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchTranslationsUseCase implements UseCase<SearchTranslationsRequestDto, Response> {
  constructor(private namespaceRepo: NamespaceRepoI, private languageRepo: LanguageRepoI) {}

  execute = async (request: SearchTranslationsRequestDto): Promise<Response> => {
    let { namespaceId, languageCodes, ...rest } = request;
    const query = rest;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      if (!languageCodes) {
        const languages = await this.languageRepo.listLanguages();
        languageCodes = languages.map((language) => language.code);
      } else {
        languageCodes = languageCodes.split(',');
      }

      const namespace = await this.namespaceRepo.searchNamespaceTranslations(
        namespaceId,
        query,
        languageCodes,
      );

      //TODO finish db query
      return right(
        Result.ok<any>({
          count: 10,
          ...namespace[0],
        }),
      );
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}

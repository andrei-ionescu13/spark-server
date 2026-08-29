import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { LanguageDto } from '../../languageMapper';
import { LanguageQueriesRepoI } from '../../repo/queries';
import { SearchLanguagesRequestDto } from './searchLanguagesRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<{ languages: LanguageDto[]; count: number }, UseCaseErrors.UnexpectedError>;

export class SearchLanguagesUseCase implements UseCase<SearchLanguagesRequestDto, Response> {
  constructor(private languageQueriesRepo: LanguageQueriesRepoI) {}

  execute = async (request: SearchLanguagesRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const searchResult = await this.languageQueriesRepo.searchLanguages(query);
      return Result.ok(searchResult);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}

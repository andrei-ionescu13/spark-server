import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { Language } from '../../language';
import { LanguageCode } from '../../languageCode';
import { LanguageCommandsRepoI } from '../../repo/commands';
import { CreateLanguageRequestDto } from './createLanguageRequestDto';

type Response = Result<Language, UseCaseErrors.UnexpectedError>;

export class CreateLanguageUseCase implements UseCase<CreateLanguageRequestDto, Response> {
  constructor(private languageCommandsRepo: LanguageCommandsRepoI) {}

  execute = async (request: CreateLanguageRequestDto): Promise<Response> => {
    try {
      const codeOrError = LanguageCode.create(request.code);

      if (codeOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(codeOrError.error.message));
      }

      const code = codeOrError.value;
      const props = { ...request, code, _id: uuidv7() };
      const languageOrError = Language.create(props);
      if (languageOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(languageOrError.error.message));
      }

      const language = languageOrError.value;
      await this.languageCommandsRepo.save(language);

      return Result.ok(language);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}

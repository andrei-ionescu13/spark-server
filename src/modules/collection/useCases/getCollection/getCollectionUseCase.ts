import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { CollectionDto } from '../../collectionMapper';
import { CollectionQueriesRepoI } from '../../repo/queries';
import { GetCollectionRequestDto } from './getCollectionRequestDto';

type Response = Result<CollectionDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetCollectionUseCase implements UseCase<GetCollectionRequestDto, Response> {
  constructor(private collectionQueriesRepo: CollectionQueriesRepoI) {}

  execute = async (request: GetCollectionRequestDto): Promise<Response> => {
    const { collectionId } = request;

    try {
      const collection = await this.collectionQueriesRepo.getCollection(collectionId);
      const found = !!collection;

      if (!found) {
        return Result.fail(new UseCaseErrors.NotFound('Collection not found'));
      }

      return Result.ok(collection);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}

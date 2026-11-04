import { UseCaseErrors } from '../../../../appErrors';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { CollectionDto, CollectionPopulatedDto } from '../../collectionMapper';
import { CollectionQueriesRepoI } from '../../repo/queries';
import { GetCollectionRequestDto } from './getCollectionRequestDto';

type Response = Result<
  CollectionPopulatedDto,
  UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound
>;

export class GetCollectionUseCase implements UseCase<GetCollectionRequestDto, Response> {
  constructor(private collectionQueriesRepo: CollectionQueriesRepoI) {}

  execute = async (request: GetCollectionRequestDto): Promise<Response> => {
    const { collectionId } = request;

    try {
      const collection = await this.collectionQueriesRepo.getCollection(collectionId);
      if (!collection) {
        return Result.fail(new UseCaseErrors.NotFound('Collection not found'));
      }

      return Result.ok(collection);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}

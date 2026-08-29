import { Mongo } from '../../../../mongo';
import { UserQueriesRepo } from '../../repo/queries';
import { GetUserController } from './getUserController';
import { GetUserUseCase } from './getUserUseCase';

const userQueriesRepo = new UserQueriesRepo(Mongo.getCollection('users'));
const getUserUseCase = new GetUserUseCase(userQueriesRepo);
export const getUserController = new GetUserController(getUserUseCase);

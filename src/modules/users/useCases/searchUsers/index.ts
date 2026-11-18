import { Mongo } from '../../../../mongo';
import { UserQueriesRepo } from '../../repo/queries';
import { SearchUsersController } from './searchUsersController';
import { SearchUsersUseCase } from './searchUsersUseCase';

const userQueriesRepo = new UserQueriesRepo();
const searchUsersUseCase = new SearchUsersUseCase(userQueriesRepo);
export const searchUsersController = new SearchUsersController(searchUsersUseCase);

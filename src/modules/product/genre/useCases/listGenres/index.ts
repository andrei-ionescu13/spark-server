import { Mongo } from '../../../../../mongo';
import { GenreQueriesRepo } from '../../repo/queries';
import { ListGenresController } from './listGenresController';
import { ListGenresUseCase } from './listGenresUseCase';

const genreQueriesRepo = new GenreQueriesRepo(Mongo.getCollection('genres'));

const listGenresUseCase = new ListGenresUseCase(genreQueriesRepo);

export const listGenresController = new ListGenresController(listGenresUseCase);

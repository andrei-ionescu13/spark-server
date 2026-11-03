import { Mongo } from '../../../../../mongo';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { CreateGenreController } from './createGenreController';
import { CreateGenreUseCase } from './createGenreUseCase';

const genreCommandsRepo = new GenreCommandsRepo(Mongo.getCollection('genres'));
const genreQueriesRepo = new GenreQueriesRepo(Mongo.getCollection('genres'));

const createGenreUseCase = new CreateGenreUseCase(genreCommandsRepo, genreQueriesRepo);

export const createGenreController = new CreateGenreController(createGenreUseCase);

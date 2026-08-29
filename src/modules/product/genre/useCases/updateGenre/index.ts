import { Mongo } from '../../../../../mongo';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { UpdateGenreController } from './updateGenreController';
import { UpdateGenreUseCase } from './updateGenreUseCase';

const genreCommandsRepo = new GenreCommandsRepo(Mongo.getCollection('genres'));
const genreQueriesRepo = new GenreQueriesRepo(Mongo.getCollection('genres'));

const updateGenreUseCase = new UpdateGenreUseCase(genreCommandsRepo, genreQueriesRepo);

export const updateGenreController = new UpdateGenreController(updateGenreUseCase);

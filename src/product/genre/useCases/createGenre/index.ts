import { GenreModel } from '../../model';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { CreateGenreController } from './createGenreController';
import { CreateGenreUseCase } from './createGenreUseCase';

const genreCommandsRepo = new GenreCommandsRepo(GenreModel);
const genreQueriesRepo = new GenreQueriesRepo(GenreModel);

const createGenreUseCase = new CreateGenreUseCase(genreCommandsRepo, genreQueriesRepo);

export const createGenreController = new CreateGenreController(createGenreUseCase);

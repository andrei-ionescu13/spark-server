import { GenreModel } from '../../model';
import { GenreCommandsRepo } from '../../repo/commands';
import { GenreQueriesRepo } from '../../repo/queries';
import { UpdateGenreController } from './updateGenreController';
import { UpdateGenreUseCase } from './updateGenreUseCase';

const genreCommandsRepo = new GenreCommandsRepo(GenreModel);
const genreQueriesRepo = new GenreQueriesRepo(GenreModel);

const updateGenreUseCase = new UpdateGenreUseCase(genreCommandsRepo, genreQueriesRepo);

export const updateGenreController = new UpdateGenreController(updateGenreUseCase);

import { GenreModel } from '../../model';
import { GenreQueriesRepo } from '../../repo/queries';
import { SearchGenreController } from './searchGenresController';
import { SearchGenresUseCase } from './searchGenresUseCase';

const genreQueriesRepo = new GenreQueriesRepo(GenreModel);

const searchGenresUseCase = new SearchGenresUseCase(genreQueriesRepo);

export const searchGenreController = new SearchGenreController(searchGenresUseCase);

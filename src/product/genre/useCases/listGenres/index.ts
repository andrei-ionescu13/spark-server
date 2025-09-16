import { GenreModel } from '../../model';
import { GenreQueriesRepo } from '../../repo/queries';
import { ListGenresController } from './listGenresController';
import { ListGenresUseCase } from './listGenresUseCase';

const genreQueriesRepo = new GenreQueriesRepo(GenreModel);

const listGenresUseCase = new ListGenresUseCase(genreQueriesRepo);

export const listGenresController = new ListGenresController(listGenresUseCase);

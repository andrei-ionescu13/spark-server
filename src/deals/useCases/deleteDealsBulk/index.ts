import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { DealRepo } from '../../dealRepo';
import { DealModel } from '../../model';
import { DeleteDealsBulkController } from './deleteDealsBulkController';
import { DeleteDealsBulkUseCase } from './deleteDealsBulkUseCase';

const dealRepo = new DealRepo(DealModel);

const uploaderService = new CloudinaryUploaderService();

const deleteDealsBulkUseCase = new DeleteDealsBulkUseCase(dealRepo, uploaderService);
export const deleteDealsBulkController = new DeleteDealsBulkController(deleteDealsBulkUseCase);

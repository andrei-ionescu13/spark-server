import express from 'express';
import type { Request, Response } from 'express';
import { searchNamespacesController } from './useCases/searchNamespaces';
import { listNamespacesController } from './useCases/listNamespaces';
import { exportNamespacesController } from './useCases/exportNamespaces';
import { getNamespaceController } from './useCases/getNamespace';
import { searchTranslationsController } from './useCases/searchTranslations';
import { createNamespaceController } from './useCases/createNamespace';
import { createTranslationController } from './useCases/createTranslation';
import { updateTranslationController } from './useCases/updateTranslation';
import { deleteNamespaceController } from './useCases/deleteNamespace';
import { deleteTranslationController } from './useCases/deleteTranslation';
import { updateNamespaceController } from './useCases/updateNamespace';
import { uploadNamespacesController } from './useCases/uploadNamespaces';
const router = express.Router();

router.get('/search', (req: Request, res: Response) =>
  searchNamespacesController.execute(req, res),
);

router.post('/upload', (req: Request, res: Response) =>
  uploadNamespacesController.execute(req, res),
);

router.get('/', (req: Request, res: Response) => listNamespacesController.execute(req, res));

router.get('/export', (req: Request, res: Response) =>
  exportNamespacesController.execute(req, res),
);

router.get('/:namespaceId', (req: Request, res: Response) =>
  getNamespaceController.execute(req, res),
);

router.get('/:namespaceId/translations/search', (req: Request, res: Response) =>
  searchTranslationsController.execute(req, res),
);

router.post('/', (req: Request, res: Response) => createNamespaceController.execute(req, res));

router.post('/:namespaceId/translation', (req: Request, res: Response) =>
  createTranslationController.execute(req, res),
);

router.put('/:namespaceId/translations/:key', (req: Request, res: Response) =>
  updateTranslationController.execute(req, res),
);
router.put('/:namespaceId/name', (req: Request, res: Response) =>
  updateNamespaceController.execute(req, res),
);

router.delete('/:namespaceId', (req: Request, res: Response) =>
  deleteNamespaceController.execute(req, res),
);
router.delete('/:namespaceId/translations/:key', (req: Request, res: Response) =>
  deleteTranslationController.execute(req, res),
);

export default router;

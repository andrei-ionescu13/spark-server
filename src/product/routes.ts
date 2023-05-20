import express, { Request, Response } from 'express';
import multer from 'multer';
import { searchProductsController } from './useCases/searchProducts';
import { getProductController } from './useCases/getProduct';
import { createProductController } from './useCases/createProduct';
import { updateProductStatusController } from './useCases/updateProductStatus';
import { updateProductMetaController } from './useCases/updateProductMeta';
import { updateProductMediaController } from './useCases/updateProductMedia';
import { searchProductKeysController } from './useCases/searchProductKeys';
import { searchProductReviewsController } from './useCases/searchProductReviews';
import { deleteProductController } from './useCases/deleteProduct';
import { updateProductDetailsController } from './useCases/updateProductDetails';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (_, file, cb) => {
    const whitelistImages = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'text/plain'];

    const whitelistKeys = ['text/plain'];

    if (
      !whitelistImages.includes(file.mimetype) &&
      (file.fieldname === 'cover' || file.fieldname === 'images[]')
    ) {
      return cb(new Error('file is not allowed'));
    }

    if (!whitelistKeys.includes(file.mimetype) && file.fieldname === 'keys') {
      return cb(new Error('file is not allowed'));
    }

    cb(null, true);
  },
});

const cpUpload = upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images[]', maxCount: 8 },
  { name: 'keys', maxCount: 1 },
]);

router.get('/', (req: Request, res: Response) => searchProductsController.execute(req, res));
router.get('/:productId', (req: Request, res: Response) => getProductController.execute(req, res));

router.post('/', cpUpload, (req: Request, res: Response) =>
  createProductController.execute(req, res),
);

router.put('/:productId/status', (req: Request, res: Response) =>
  updateProductStatusController.execute(req, res),
);

router.delete('/:productId', (req: Request, res: Response) =>
  deleteProductController.execute(req, res),
);

// router.delete('/', productController.deleteMultipleProducts);
router.put('/:productId/meta', (req: Request, res: Response) =>
  updateProductMetaController.execute(req, res),
);

router.put('/:productId/media', cpUpload, (req: Request, res: Response) =>
  updateProductMediaController.execute(req, res),
);

router.put('/:productId/general', cpUpload, (req: Request, res: Response) =>
  updateProductDetailsController.execute(req, res),
);

router.get('/:productId/keys', (req: Request, res: Response) =>
  searchProductKeysController.execute(req, res),
);

// router.delete('/:id/keys/:keyId', productController.deleteProductKey);
// router.post('/:productId/keys', productController.addProductKey);
// router.post('/:id/keys/import', upload.single('keys'), productController.importProductKeys);
router.get('/:productId/reviews', (req: Request, res: Response) =>
  searchProductReviewsController.execute(req, res),
);

export default router;

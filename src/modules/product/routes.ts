import express, { Request, Response } from 'express';
import multer from 'multer';
import { createProductController } from './useCases/createProduct';
import { deleteProductController } from './useCases/deleteProduct';
import { getProductController } from './useCases/getProduct';
import { importProductKeysController } from './useCases/importProductKeys';
import { searchProductKeysController } from './useCases/searchProductKeys';
import { searchProductReviewsController } from './useCases/searchProductReviews';
import { searchProductsController } from './useCases/searchProducts';
import { updateProductDetailsController } from './useCases/updateProductDetails';
import { updateProductMediaController } from './useCases/updateProductMedia';
import { updateProductMetaController } from './useCases/updateProductMeta';
import { updateProductStatusController } from './useCases/updateProductStatus';
const router = express.Router();

const storage = multer.memoryStorage();

const uploadImages = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const whitelistTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'text/plain'];
    if (!whitelistTypes.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'));
    }

    cb(null, true);
  },
});

const createProductUpload = uploadImages.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'allImages[]', maxCount: 20 },
]);

const updateMediaUpload = uploadImages.fields([
  { name: 'coverFile', maxCount: 1 },
  { name: 'allImageFiles[]', maxCount: 20 },
]);

const upload = multer({
  storage: storage,
  fileFilter: (_, file, cb) => {
    const whitelist = ['text/plain'];

    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'));
    }

    cb(null, true);
  },
});

router.get('/', (req: Request, res: Response) => searchProductsController.execute(req, res));
router.get('/:productId', (req: Request, res: Response) => getProductController.execute(req, res));

router.post('/', createProductUpload, (req: Request, res: Response) => {
  return createProductController.execute(req, res);
});

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

router.put('/:productId/media', updateMediaUpload, (req: Request, res: Response) =>
  updateProductMediaController.execute(req, res),
);

router.put('/:productId/general', createProductUpload, (req: Request, res: Response) =>
  updateProductDetailsController.execute(req, res),
);

router.get('/:productId/keys', (req: Request, res: Response) =>
  searchProductKeysController.execute(req, res),
);

// router.delete('/:id/keys/:keyId', productController.deleteProductKey);
// router.post('/:productId/keys', productController.addProductKey);
router.post('/:productId/keys/import', upload.single('keys'), (req: Request, res: Response) =>
  importProductKeysController.execute(req, res),
);
router.get('/:productId/reviews', (req: Request, res: Response) =>
  searchProductReviewsController.execute(req, res),
);

export default router;

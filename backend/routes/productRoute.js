import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/auth.js';
import { permit } from '../middleware/permissions.js';
import { validateAndScanUploads } from '../middleware/fileSecurity.js';

const productRouter = express.Router();

// Admin: Add product
productRouter.post(
    '/add',
    authUser,
    permit('admin'),
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]),
    validateAndScanUploads,   
    addProduct
);

// Admin: Remove product
productRouter.post('/remove', authUser, permit('admin'), removeProduct);

// Public: Single product
productRouter.post('/single', singleProduct);

// Public: List products
productRouter.get('/list', listProducts);

export default productRouter;

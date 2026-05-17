import express from 'express';
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js';
import authUser from '../middleware/auth.js';
import { permit } from '../middleware/permissions.js';

const cartRouter = express.Router();

// User/Admin: Get cart
cartRouter.post('/get', authUser, permit('user', 'admin'), getUserCart);

// User/Admin: Add to cart
cartRouter.post('/add', authUser, permit('user', 'admin'), addToCart);

// User/Admin: Update cart
cartRouter.post('/update', authUser, permit('user', 'admin'), updateCart);

export default cartRouter;

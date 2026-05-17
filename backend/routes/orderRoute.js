import express from 'express';
import { 
    placeOrder, 
    placeOrderStripe, 
    allOrders, 
    userOrders, 
    updateStatus, 
    verifyStripe 
} from '../controllers/orderController.js';
import authUser from '../middleware/auth.js';
import { permit } from '../middleware/permissions.js';

const orderRouter = express.Router();

// Admin: View all orders
orderRouter.post('/list', authUser, permit('admin'), allOrders);

// Admin: Update order status
orderRouter.post('/status', authUser, permit('admin'), updateStatus);

// User/Admin: Place order
orderRouter.post('/place', authUser, permit('user', 'admin'), placeOrder);

// User/Admin: Stripe checkout
orderRouter.post('/stripe', authUser, permit('user', 'admin'), placeOrderStripe);

// User/Admin: Get user-specific orders
orderRouter.post('/userorders', authUser, permit('user', 'admin'), userOrders);

// User/Admin: Verify Stripe payment
orderRouter.post('/verifyStripe', authUser, permit('user', 'admin'), verifyStripe);

export default orderRouter;

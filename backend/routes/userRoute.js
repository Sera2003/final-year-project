import express from 'express';
import {
  loginUser,
  registerUser,
  adminLogin,
  forgotPassword,
  resetPassword,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateDeliveryAddress,
  getDeliveryAddress,
  getAllUsers
} from '../controllers/userController.js';
import authUser from "../middleware/auth.js";
import upload from '../middleware/multer.js';
import { permit } from '../middleware/permissions.js';

const userRouter = express.Router();

userRouter.post('/register', upload.single('profilePicture'), registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/logout', authUser, logoutUser);

userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, upload.single('profilePicture'), updateUserProfile);

userRouter.get('/delivery-address', authUser, getDeliveryAddress);
userRouter.put('/delivery-address', authUser, updateDeliveryAddress);

userRouter.get('/all', authUser, permit('admin'), getAllUsers);

export default userRouter;

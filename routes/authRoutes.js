import express from "express";
import {register, verifyUser, login, user, forgotPassword, verifyResetPasswordToken, updatePassword, admin} from '../controllers/authController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


//Auth and registration routes
router.post('/register', register);
router.get('/verify/:token', verifyUser);
router.post('/login', login);

//forgot password routes
router.post('/forgot-password', forgotPassword);
router.get('/forgot-password/:token', verifyResetPasswordToken)
router.post('/forgot-password/:token', updatePassword)

//Needs auth - requires jwt
router.get('/user', authMiddleware, user)
router.get('/admin', authMiddleware, admin)


export default router
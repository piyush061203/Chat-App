import express from 'express';
import {signin, signout, signup, getUser, updateuser} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router=express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', isAuthenticated, signout);
router.get('/getuser', isAuthenticated, getUser);
router.put('/updateuser', isAuthenticated, updateuser);

export default router;
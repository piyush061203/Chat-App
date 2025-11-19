import express from 'express';
import {signin, signout, signup, getuser, updateuser} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router=express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', isAuthenticated, signout);
router.get('/getuser', isAuthenticated, getuser);
router.put('/updateuser', isAuthenticated, updateuser);

export default router;
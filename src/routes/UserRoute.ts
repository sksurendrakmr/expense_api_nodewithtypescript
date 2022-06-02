import {Router} from 'express';
import { getUserDetails, loginUser, registerUser } from '../controller/UserController';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/me',auth,getUserDetails)

export default router;
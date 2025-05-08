import { Router, RequestHandler } from 'express';
import { register, login } from '../controllers/authControllers';

const router = Router();

// @ts-ignore - Suppressing type error due to Express v4/v5 compatibility issues
router.post('/register', register as RequestHandler);
// @ts-ignore - Suppressing type error due to Express v4/v5 compatibility issues
router.post('/login', login as RequestHandler);

export default router;

import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/protected', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});

export default router;

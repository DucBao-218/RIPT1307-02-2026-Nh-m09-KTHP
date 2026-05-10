import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';
import { 
  createBorrowRequest, 
  updateBorrowStatus, 
  getMyHistory, 
  getAllRequests, 
  getTopBorrowed 
} from '../controllers/borrowController';

const router = Router();

// Student routes
router.post('/', authenticate, createBorrowRequest);
router.get('/my-history', authenticate, getMyHistory);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllRequests);
router.get('/top-borrowed', authenticate, authorizeAdmin, getTopBorrowed);
router.put('/:id/status', authenticate, authorizeAdmin, updateBorrowStatus);

export default router;

import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';
import { 
  getAllEquipments, 
  getAvailableEquipments, 
  createEquipment, 
  updateEquipment, 
  deleteEquipment 
} from '../controllers/equipmentController';

const router = Router();

// Public/Student routes
router.get('/available', authenticate, getAvailableEquipments);
router.get('/', authenticate, getAllEquipments);

// Admin routes
router.post('/', authenticate, authorizeAdmin, createEquipment);
router.put('/:id', authenticate, authorizeAdmin, updateEquipment);
router.delete('/:id', authenticate, authorizeAdmin, deleteEquipment);

export default router;

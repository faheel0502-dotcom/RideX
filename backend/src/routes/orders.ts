import { Router } from 'express';
import { checkout, verifyPayment, getUserOrders, getOrderDetails, adminGetOrders, adminUpdateOrderStatus } from '../controllers/orders';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Authenticated Client Routes
router.post('/checkout', requireAuth, checkout);
router.post('/verify-payment', requireAuth, verifyPayment);
router.get('/', requireAuth, getUserOrders);
router.get('/:id', requireAuth, getOrderDetails);

// Admin Routes
router.get('/admin/list', requireAdmin, adminGetOrders);
router.put('/admin/:id/status', requireAdmin, adminUpdateOrderStatus);

export default router;

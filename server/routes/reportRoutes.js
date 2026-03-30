import express from 'express';
import { createReport, getAllReports, getUserReports, markReportReviewed } from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getAllReports);
router.get('/me', authMiddleware, getUserReports);
router.post('/', authMiddleware, createReport);
router.patch('/:id/review', authMiddleware, adminMiddleware, markReportReviewed);

export default router;

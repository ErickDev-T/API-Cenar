import express from "express";
import { getDashboardMetrics } from "../controllers/adminDashboard.controller.js";
import verifyToken, { requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Obtener métricas del dashboard administrativo
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas obtenidas correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get(
  "/",
  verifyToken,
  requireRole("Admin"),
  getDashboardMetrics
);

export default router;
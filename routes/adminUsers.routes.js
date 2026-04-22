import express from "express";
import {
  getClients,
  getDeliveries,
  getCommerces,
  getAdministrators,
  createAdministrator,
  updateAdministrator,
  updateUserStatus
} from "../controllers/adminUsers.controller.js";

import {
  validateCreateAdmin,
  validateUpdateAdmin,
  validateUpdateUserStatus,
  validatePagination
} from "./validations/adminUsers.validations.js";

import { handleValidationErrors } from "../middlewares/handleValidation.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { Roles } from "../utils/enums/roles.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/users/clients:
 *   get:
 *     summary: Obtener clientes
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/clients",
  verifyJWT,
  requireRole(Roles.ADMIN),
  validatePagination,
  handleValidationErrors(),
  getClients
);

/**
 * @swagger
 * /api/admin/users/deliveries:
 */
router.get(
  "/deliveries",
  verifyJWT,
  requireRole(Roles.ADMIN),
  validatePagination,
  handleValidationErrors(),
  getDeliveries
);

/**
 * @swagger
 * /api/admin/users/commerces:
 */
router.get(
  "/commerces",
  verifyJWT,
  requireRole(Roles.ADMIN),
  validatePagination,
  handleValidationErrors(),
  getCommerces
);

/**
 * @swagger
 * /api/admin/users/admins:
 */
router.get(
  "/admins",
  verifyJWT,
  requireRole(Roles.ADMIN),
  validatePagination,
  handleValidationErrors(),
  getAdministrators
);

/**
 * @swagger
 * /api/admin/users/admins:
 *   post:
 *     summary: Crear administrador
 *     tags: [Admin Users]
 */
router.post(
  "/admins",
  verifyJWT,
  requireRole(Roles.ADMIN),
  validateCreateAdmin,
  handleValidationErrors(),
  createAdministrator
);

/**
 * @swagger
 * /api/admin/users/admins/{id}:
 *   put:
 *     summary: Actualizar administrador
 *     tags: [Admin Users]
 */
router.put(
  "/admins/:id",
  verifyJWT,
  requireRole(Roles.ADMIN),
  validateUpdateAdmin,
  handleValidationErrors(),
  updateAdministrator
);

/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   patch:
 *     summary: Cambiar estado de usuario
 *     tags: [Admin Users]
 */
router.patch(
  "/:id/status",
  verifyJWT,
  requireRole(Roles.ADMIN),
  validateUpdateUserStatus,
  handleValidationErrors(),
  updateUserStatus
);

export default router;
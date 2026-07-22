import { Router } from "express";
import { TicketController } from "../controllers/TicketController";
import { TicketService } from "../services/TicketService";
import { TicketRepository } from "../repositories/TicketRepository";
import { UserRepository } from "../repositories/UserRepository";
import { ClassificationService } from "../services/ClassificationService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AuthenticatedRequest } from "../types";

const router = Router();
const controller = new TicketController(
  new TicketService(new TicketRepository(), new UserRepository(), new ClassificationService())
);

router.use(authMiddleware);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Lista todos os tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tickets
 */
router.get("/", asyncHandler((req, res) => controller.findAll(req as AuthenticatedRequest, res)));

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Busca ticket por ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *       404:
 *         description: Ticket não encontrado
 */
router.get("/:id", asyncHandler((req, res) => controller.findById(req as AuthenticatedRequest, res)));

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Cria um novo ticket (classificado automaticamente por IA)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket criado e classificado
 */
router.post("/", asyncHandler((req, res) => controller.create(req as AuthenticatedRequest, res)));

/**
 * @swagger
 * /tickets/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [aberto, em_atendimento, resolvido]
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch("/:id/status", asyncHandler((req, res) => controller.updateStatus(req as AuthenticatedRequest, res)));

export default router;

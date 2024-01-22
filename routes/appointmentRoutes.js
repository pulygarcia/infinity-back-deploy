import express from "express";
import { createAppointment,  getAppointmentByDate, getAppointmentById, updateAppointment, cancelAppointment} from "../controllers/appointmentController.js";
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

//router.get('/', getUserAppointments)
router.post('/', authMiddleware, createAppointment) //user can add appointments only if is auth
router.get('/', authMiddleware, getAppointmentByDate)
router.get('/:id', authMiddleware, getAppointmentById)
router.put('/:id', authMiddleware, updateAppointment)
router.delete('/:id', authMiddleware, cancelAppointment)

export default router
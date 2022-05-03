import express from "express";
import { actualizarPaciente, eliminarPaciente, nuevoPaciente, obtenerPaciente, obtenerPacientes } from "../controllers/pacienteController.js";
import checkAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/').post(checkAuth, nuevoPaciente).get(checkAuth, obtenerPacientes);
router.route('/:id').get(checkAuth, obtenerPaciente).put(checkAuth, actualizarPaciente).delete(checkAuth, eliminarPaciente);

export default router;

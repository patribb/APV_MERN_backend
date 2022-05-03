import express from "express";
import { autenticar, comprobarToken, confirmar, nuevaContraseña, olvideContraseña, perfil, registrar, actualizarPerfil, actualizarContraseña } from "../controllers/veterinarioController.js";
import checkAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

// rutas públicas
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvideContraseña)
router.route('/olvide-password/:token').get(comprobarToken).post(nuevaContraseña)
// rutas privadas
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil)
router.put('/actualizar-password', checkAuth, actualizarContraseña)

export default router;
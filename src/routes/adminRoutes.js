import { Router } from 'express';
import { registrarAdmin, loginAdmin, listarAdmins, buscarAdminPorId, atualizarAdmin, deletarAdmin } from '../controllers/adminController.js';

const router = Router();

router.post('/cadastro', registrarAdmin);
router.post('/login', loginAdmin);
router.get('/', listarAdmins);
router.get('/:id', buscarAdminPorId);
router.put('/:id', atualizarAdmin);
router.delete('/:id', deletarAdmin);

export default router;
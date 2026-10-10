import { Router } from 'express';
import { registrarEmpresa, loginEmpresa, listarEmpresas, buscarEmpresaPorId, atualizarEmpresa, deletarEmpresa } from '../controllers/empresaController.js';

const router = Router();

router.post('/cadastro', registrarEmpresa);
router.post('/login', loginEmpresa);
router.get('/', listarEmpresas);
router.get('/:id', buscarEmpresaPorId);
router.put('/:id', atualizarEmpresa);
router.delete('/:id', deletarEmpresa);

export default router;
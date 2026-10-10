import { Router } from 'express';
import { registrarCandidato, loginCandidato, listarCandidatos, atualizarCandidato, deletarCandidato } from '../controllers/candidatoController.js';

const router = Router();

router.post('/cadastro', registrarCandidato);
router.post('/login', loginCandidato);
router.get('/', listarCandidatos);
router.put('/:id', atualizarCandidato);
router.delete('/:id', deletarCandidato);

export default router;
import { Router } from 'express';
import { criarCurriculo, listarCurriculoPorCandidato, atualizarCurriculo, deletarCurriculo } from '../controllers/curriculoController.js';

const router = Router();

router.post('/curriculos', criarCurriculo);
router.get('/curriculos/candidato/:idCandidato', listarCurriculoPorCandidato);
router.put('/curriculos/:id', atualizarCurriculo);
router.delete('/curriculos/:id', deletarCurriculo);

export default router;
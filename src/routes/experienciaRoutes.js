import {Router } from 'express';
import {criarExperiencia, listarExperienciasPorCandidato, atualizarExperiencia, deletarExperiencia } from '../controllers/experienciaController.js';

const router = Router();

router.post('/experiencias', criarExperiencia);
router.get('/experiencias/candidato/:idCandidato', listarExperienciasPorCandidato);
router.put('/experiencias/:id', atualizarExperiencia);
router.delete('/experiencias/:id', deletarExperiencia);

export default router;
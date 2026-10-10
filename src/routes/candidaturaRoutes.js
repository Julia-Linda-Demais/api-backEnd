import { Router } from 'express';
import {criarCandidatura, listarCandidaturasPorCandidato, listarCandidatosPorVaga, atualizarStatusCandidatura, deletarCandidatura } from '../controllers/candidaturaController.js';

const router = Router();

router.post('/candidaturas', criarCandidatura);
router.get('/candidaturas/candidato/:idCandidato', listarCandidaturasPorCandidato);
router.get('/candidaturas/vaga/:idVaga', listarCandidatosPorVaga);
router.put('/candidaturas/:id', atualizarStatusCandidatura);
router.delete('/candidaturas/:id', deletarCandidatura);

export default router;
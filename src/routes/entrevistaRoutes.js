import { Router } from 'express';
import { agendarEntrevista, listarEntrevistasPorCandidato, listarEntrevistasPorVaga, atualizarEntrevista, deletarEntrevista } from '../controllers/entrevistaController.js';

const router = Router();

router.post('/entrevistas', agendarEntrevista);
router.get('/entrevistas/candidato/:idCandidato', listarEntrevistasPorCandidato);
router.get('/entrevistas/vaga/:idVaga', listarEntrevistasPorVaga);
router.put('/entrevistas/:id', atualizarEntrevista);
router.delete('/entrevistas/:id', deletarEntrevista);

export default router;
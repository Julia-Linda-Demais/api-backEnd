import { Router } from 'express';
import { criarFormacao, listarFormacoes, atualizarFormacao, deletarFormacao } from '../controllers/FormacaoController.js';

const router = Router();

router.post('/formacoes', criarFormacao);
router.get('/formacoes/candidato/:idCandidato', listarFormacoes);
router.put('/formacoes/:id', atualizarFormacao);
router.delete('/formacoes/:id', deletarFormacao);

export default router;
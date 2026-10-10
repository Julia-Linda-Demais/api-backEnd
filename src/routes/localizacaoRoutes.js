import { Router } from 'express';
import {criarLocalizacao, listarLocalizacoes, buscarLocalizacaoPorId, atualizarLocalizacao, deletarLocalizacao } from '../controllers/localizacaoController.js';

const router = Router();

router.post('/localizacoes', criarLocalizacao);
router.get('/localizacoes', listarLocalizacoes);
router.get('/localizacoes/:id', buscarLocalizacaoPorId);
router.put('/localizacoes/:id', atualizarLocalizacao);
router.delete('/localizacoes/:id', deletarLocalizacao);

export default router;
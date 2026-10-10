import { Router } from 'express';
import {criarPesquisaSalva, listarPesquisasSalvasPorCandidato, atualizarPesquisaSalva, deletarPesquisaSalva } from '../controllers/pesquisaSalvaController.js';

const router = Router();

router.post('/pesquisas-salvas', criarPesquisaSalva);
router.get('/pesquisas-salvas/candidato/:idCandidato', listarPesquisasSalvasPorCandidato);
router.put('/pesquisas-salvas/:id', atualizarPesquisaSalva);
router.delete('/pesquisas-salvas/:id', deletarPesquisaSalva);

export default router;
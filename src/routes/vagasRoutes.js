import { Router } from 'express';
import { criarVaga, listarVagas, atualizarVaga, deletarVaga, favoritarVaga, listarFavoritas, desfavoritarVaga } from '../controllers/vagaController.js';

const router = Router();

// Rotas de Vagas (CRUD Completo)
router.post('/vagas', criarVaga);
router.get('/vagas', listarVagas);
router.put('/vagas/:id', atualizarVaga);
router.delete('/vagas/:id', deletarVaga);

// Rotas de Vagas Favoritas (Sem PUT!)
router.post('/vagas-favoritas', favoritarVaga);
router.get('/vagas-favoritas/:idCandidato', listarFavoritas);
router.delete('/vagas-favoritas/:id', desfavoritarVaga);

export default router;
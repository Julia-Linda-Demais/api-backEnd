import { Router } from 'express';
import {criarHabilidade, listarHabilidades, adicionarHabilidadeCandidato, listarHabilidadesPorCandidato, atualizarHabilidadeCandidato, removerHabilidadeCandidato } from '../controllers/habilidadeController.js';

const router = Router();

//habilidades
router.post('/habilidades', criarHabilidade);
router.get('/habilidades', listarHabilidades);

//candidato_hablidade
router.post('/candidato-habilidades', adicionarHabilidadeCandidato);
router.get('/candidato-habilidades/:idCandidato', listarHabilidadesPorCandidato);
router.put('/candidato-habilidades/:idCandidato/:idHabilidade', atualizarHabilidadeCandidato);
router.delete('/candidato-habilidades/:idCandidato/:idHabilidade', removerHabilidadeCandidato);

export default router;
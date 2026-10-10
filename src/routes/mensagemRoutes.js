import { Router } from 'express';
import {enviarMensagem, listarMensagensConversa, marcarComoLida, deletarMensagem } from '../controllers/mensagemController.js';

const router = Router();

router.post('/mensagens', enviarMensagem);
router.get('/mensagens/conversa/:idCandidato/:idEmpresa', listarMensagensConversa);
router.put('/mensagens/:id/lida', marcarComoLida);
router.delete('/mensagens/:id', deletarMensagem);

export default router;
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import empresaRoutes from './routes/empresaRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import vagasRoutes from './routes/vagasRoutes.js';
import formacaoRoutes from './routes/FormacaoRoutes.js';
import candidaturaRoutes from './routes/candidaturaRoutes.js';
import curriculoRoutes from './routes/curriculoRoutes.js';
import entrevistaRoutes from './routes/entrevistaRoutes.js';
import experienciaRoutes from './routes/experienciaRoutes.js';
import habilidadeRoutes from './routes/habilidadeRoutes.js';
import mensagemRoutes from './routes/mensagemRoutes.js';
import pesquisaSalvaRoutes from './routes/pesquisaSalvaRoutes.js';
import localizacaoRoutes from './routes/localizacaoRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.use('/api/candidatos', authRoutes); // Mantive a do candidato
app.use('/api/empresas', empresaRoutes); // Novas rotas de empresa
app.use('/api/admins', adminRoutes);     // Novas rotas de admin
app.use('/api', vagasRoutes);             
app.use('/api', formacaoRoutes);         
app.use('/api', candidaturaRoutes);      
app.use('/api', curriculoRoutes);        
app.use('/api', entrevistaRoutes);       
app.use('/api', experienciaRoutes);      
app.use('/api', habilidadeRoutes);       
app.use('/api', mensagemRoutes);         
app.use('/api', pesquisaSalvaRoutes); 
app.use('/api', localizacaoRoutes);

export default app;
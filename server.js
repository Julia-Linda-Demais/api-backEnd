import app from './src/app.js';

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`--- ROTAS DISPONÍVEIS ---`);
  console.log(`Candidatos:     /api/candidatos`);
  console.log(`Empresas:       /api/empresas`);
  console.log(`Administradores:/api/admins`);
  console.log(`Vagas:          /api/vagas`);
  console.log(`Vagas Favoritas:/api/vagas-favoritas`);
  console.log(`Formações:      /api/formacoes`);
  console.log(`Candidaturas:   /api/candidaturas`);
  console.log(`Currículos:     /api/curriculos`);
  console.log(`Entrevistas:    /api/entrevistas`);
  console.log(`Experiências:   /api/experiencias`);
  console.log(`Habilidades:    /api/habilidades & /api/candidato-habilidades`);
  console.log(`Mensagens:      /api/mensagens`);
  console.log(`Pesquisas Salvas:/api/pesquisas-salvas`);
  console.log(`Localizações:   /api/localizacoes`);
});
import pool from '../data/bd.js';

// post
export const criarFormacao = async (req, res) => {
  try {
    const { 
      idCandidato, 
      curso, 
      instituicao, 
      nivel, 
      dataInicio, 
      dataConclusao, 
      situacao 
    } = req.body; //aqui ele pega os atributos

    if (!idCandidato || !curso || !instituicao) {
      return res.status(400).json({ erro: "idCandidato, curso e instituição são obrigatórios." });
    } //vê se a pessoa realmente add os atributos obrigátoios

    const [resultado] = await pool.query(
      `INSERT INTO Formacao 
      (idCandidato, curso, instituicao, nivel, dataInicio, dataConclusao, situacao) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idCandidato, 
        curso, 
        instituicao, 
        nivel || null, 
        dataInicio || null, 
        dataConclusao || null, 
        situacao || null
      ]
    ); //insere os dados coletados no bd real

    return res.status(201).json({ 
      mensagem: "Formação criada com sucesso!", 
      formacao: { idFormacao: resultado.insertId, idCandidato, curso, instituicao } 
    }); //mostra sucesso e apresenta as infos inseridas
  } catch (error) {
    console.error("Erro ao criar formação:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// Listar formações de um candidato (get)
export const listarFormacoes = async (req, res) => {
  try {
    const { idCandidato } = req.params; 

    const [formacoes] = await pool.query(
      'SELECT * FROM Formacao WHERE idCandidato = ?', 
      [idCandidato]
    ); //pega o candidato "inserido" e põe no banco, para fazer a listagem dos dados desse user

    return res.status(200).json(formacoes); //listando as infos
  } catch (error) {
    console.error("Erro ao listar formações:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// put
export const atualizarFormacao = async (req, res) => {
  try {
    const { id } = req.params; // idFormacao
    const dadosAtualizados = req.body;

    const [formacaoExiste] = await pool.query('SELECT * FROM Formacao WHERE idFormacao = ?', [id]); //vai caçar se esse user realmente tem alguma formação
    if (formacaoExiste.length === 0) {
      return res.status(404).json({ erro: "Formação não encontrada." });
    }

    //esse Object keys é para listar tds os atributos dessa função
    const campos = Object.keys(dadosAtualizados);
    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
    }

    const valores = campos.map(campo => dadosAtualizados[campo]);
    valores.push(id); //ta vendo oq mudou e vai trazer para o bd real

    const setString = campos.map(campo => `${campo} = ?`).join(', ');

    await pool.query(`UPDATE Formacao SET ${setString} WHERE idFormacao = ?`, valores);

    return res.status(200).json({ mensagem: "Formação atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar formação:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// delete
export const deletarFormacao = async (req, res) => {
  try {
    const { id } = req.params; // idFormacao

    const [formacaoExiste] = await pool.query('SELECT * FROM Formacao WHERE idFormacao = ?', [id]);
    if (formacaoExiste.length === 0) {
      return res.status(404).json({ erro: "Formação não encontrada." });
    } //ve se a formação existe

    await pool.query('DELETE FROM Formacao WHERE idFormacao = ?', [id]);

    return res.status(200).json({ mensagem: "Formação removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar formação:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
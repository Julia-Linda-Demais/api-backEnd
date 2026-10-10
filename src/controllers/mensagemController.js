import pool from '../data/bd.js';

//post
export const enviarMensagem = async (req, res) => {
  try {
    const { idCandidato, idEmpresa, idVaga, remetente, conteudo } = req.body;

    if (!idCandidato || !idEmpresa || !remetente || !conteudo) {
      return res.status(400).json({ erro: "idCandidato, idEmpresa, remetente e conteúdo são obrigatórios." });
    }

    const [resultado] = await pool.query(
      `INSERT INTO Mensagem 
      (idCandidato, idEmpresa, idVaga, remetente, conteúdo, dataEnvio, lida) 
      VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [
        idCandidato, 
        idEmpresa, 
        idVaga || null, 
        remetente, 
        conteudo, 
        false // lida inicialmente como falso
      ]
    );

    return res.status(201).json({
      mensagem: "Mensagem enviada com sucesso!",
      dadosMensagem: {
        idMensagem: resultado.insertId,
        idCandidato,
        idEmpresa,
        idVaga,
        remetente,
        conteudo,
        dataEnvio: new Date(),
        lida: false
      }
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//get especifico
export const listarMensagensConversa = async (req, res) => {
  try {
    const { idCandidato, idEmpresa } = req.params;
    const { idVaga } = req.query;

    let query = `
      SELECT m.*, 
             cand.nome AS candidatoNome, 
             emp.razaoSocial AS empresaNome 
      FROM Mensagem m
      INNER JOIN Candidato cand ON m.idCandidato = cand.idCandidato
      INNER JOIN Empresa emp ON m.idEmpresa = emp.idEmpresa
      WHERE m.idCandidato = ? AND m.idEmpresa = ?
    `;
    
    const params = [idCandidato, idEmpresa];

    if (idVaga) {
      query += ` AND m.idVaga = ?`;
      params.push(idVaga);
    }

    query += ` ORDER BY m.dataEnvio ASC`;

    const [mensagens] = await pool.query(query, params);

    return res.status(200).json(mensagens);
  } catch (error) {
    console.error("Erro ao listar mensagens:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//put
export const marcarComoLida = async (req, res) => {
  try {
    const { id } = req.params; // idMensagem

    const [mensagemExiste] = await pool.query(
      'SELECT * FROM Mensagem WHERE idMensagem = ?', 
      [id]
    );

    if (mensagemExiste.length === 0) {
      return res.status(404).json({ erro: "Mensagem não encontrada." });
    }

    await pool.query(
      'UPDATE Mensagem SET lida = true WHERE idMensagem = ?',
      [id]
    );

    return res.status(200).json({ mensagem: "Mensagem marcada como lida." });
  } catch (error) {
    console.error("Erro ao atualizar status da mensagem:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//delete
export const deletarMensagem = async (req, res) => {
  try {
    const { id } = req.params; // idMensagem

    const [mensagemExiste] = await pool.query(
      'SELECT * FROM Mensagem WHERE idMensagem = ?', 
      [id]
    );

    if (mensagemExiste.length === 0) {
      return res.status(404).json({ erro: "Mensagem não encontrada." });
    }

    await pool.query('DELETE FROM Mensagem WHERE idMensagem = ?', [id]);

    return res.status(200).json({ mensagem: "Mensagem removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar mensagem:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
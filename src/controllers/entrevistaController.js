import pool from '../data/bd.js';

// post
export const agendarEntrevista = async (req, res) => {
  try {
    const { idCandidato, idVaga, data_entrevista, horario, local, tipo, status } = req.body;

    if (!idCandidato || !idVaga || !data_entrevista || !horario) {
      return res.status(400).json({ erro: "idCandidato, idVaga, data_entrevista e horário são obrigatórios." });
    } //ve se a pessoa add os atributos obrigatorios

    const [resultado] = await pool.query(
      `INSERT INTO Entrevista 
      (idCandidato, idVaga, data_entrevista, horario, local, tipo, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idCandidato, 
        idVaga, 
        data_entrevista, 
        horario, 
        local || null, 
        tipo || null, 
        status || 'Agendada'
      ]
    );

    return res.status(201).json({
      mensagem: "Entrevista agendada com sucesso!",
      entrevista: {
        idEntrevista: resultado.insertId,
        idCandidato,
        idVaga,
        data_entrevista,
        horario,
        local,
        tipo,
        status: status || 'Agendada'
      }
    });
  } catch (error) {
    console.error("Erro ao agendar entrevista:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// get
export const listarEntrevistasPorCandidato = async (req, res) => {
  try {
    const { idCandidato } = req.params;

    const [entrevistas] = await pool.query(
      `SELECT e.*, v.titulo AS vagaTitulo, emp.razaoSocial AS empresaNome
       FROM Entrevista e
       INNER JOIN Vaga v ON e.idVaga = v.idVaga
       INNER JOIN Empresa emp ON v.idEmpresa = emp.idEmpresa
       WHERE e.idCandidato = ?`,
      [idCandidato]
    );

    return res.status(200).json(entrevistas);
  } catch (error) {
    console.error("Erro ao listar entrevistas do candidato:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// get especifico
export const listarEntrevistasPorVaga = async (req, res) => {
  try {
    const { idVaga } = req.params;

    const [entrevistas] = await pool.query(
      `SELECT e.*, cand.nome AS candidatoNome, cand.email, cand.telefone
       FROM Entrevista e
       INNER JOIN Candidato cand ON e.idCandidato = cand.idCandidato
       WHERE e.idVaga = ?`,
      [idVaga]
    );

    return res.status(200).json(entrevistas);
  } catch (error) {
    console.error("Erro ao listar entrevistas da vaga:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// put
export const atualizarEntrevista = async (req, res) => {
  try {
    const { id } = req.params; // idEntrevista
    const dadosAtualizados = req.body;

    const [entrevistaExiste] = await pool.query(
      'SELECT * FROM Entrevista WHERE idEntrevista = ?', 
      [id]
    );

    if (entrevistaExiste.length === 0) {
      return res.status(404).json({ erro: "Entrevista não encontrada." });
    }

    const campos = [];
    const valores = [];

    //esse Object keys é para listar tds os atributos dessa função
    Object.keys(dadosAtualizados).forEach(chave => {
      campos.push(`${chave} = ?`);
      valores.push(dadosAtualizados[chave]);
    });

    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
    }

    valores.push(id);

    await pool.query(
      `UPDATE Entrevista SET ${campos.join(', ')} WHERE idEntrevista = ?`,
      valores
    );

    return res.status(200).json({ mensagem: "Entrevista atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar entrevista:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// Delete
export const deletarEntrevista = async (req, res) => {
  try {
    const { id } = req.params; // idEntrevista

    const [entrevistaExiste] = await pool.query(
      'SELECT * FROM Entrevista WHERE idEntrevista = ?', 
      [id]
    );

    if (entrevistaExiste.length === 0) {
      return res.status(404).json({ erro: "Entrevista não encontrada." });
    }

    await pool.query('DELETE FROM Entrevista WHERE idEntrevista = ?', [id]);

    return res.status(200).json({ mensagem: "Entrevista removida/cancelada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar entrevista:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
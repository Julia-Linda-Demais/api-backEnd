import pool from '../data/bd.js';

//post
export const criarCandidatura = async (req, res) => {
  try {
    const { idCandidato, idVaga, mensagem } = req.body;

    if (!idCandidato || !idVaga) {
      return res.status(400).json({ erro: "idCandidato e idVaga são obrigatórios." });
    }

    // Vê se o candidato já se canditatou a essa vaga
    const [jaCandidatado] = await pool.query(
      'SELECT * FROM Candidatura WHERE idCandidato = ? AND idVaga = ?',
      [idCandidato, idVaga]
    );

    if (jaCandidatado.length > 0) {
      return res.status(400).json({ erro: "Você já se candidatou a esta vaga." });
    }

    const [resultado] = await pool.query(
      `INSERT INTO Candidatura 
      (idCandidato, idVaga, dataCandidatura, mensagem, status) 
      VALUES (?, ?, NOW(), ?, ?)`,
      [idCandidato, idVaga, mensagem || null, 'Em Análise']
    );

    return res.status(201).json({
      mensagem: "Candidatura enviada com sucesso!",
      candidatura: {
        idCandidatura: resultado.insertId,
        idCandidato,
        idVaga,
        status: 'Em Análise'
      }
    });
  } catch (error) {
    console.error("Erro ao criar candidatura:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// get específico
export const listarCandidaturasPorCandidato = async (req, res) => {
  try {
    const { idCandidato } = req.params;

    const [candidaturas] = await pool.query(
      `SELECT c.*, v.titulo, v.salario, v.modeloTrabalho, e.nomeFantasia AS empresa
       FROM Candidatura c
       INNER JOIN Vaga v ON c.idVaga = v.idVaga
       INNER JOIN Empresa e ON v.idEmpresa = e.idEmpresa
       WHERE c.idCandidato = ?`,
      [idCandidato]
    );

    return res.status(200).json(candidaturas);
  } catch (error) {
    console.error("Erro ao listar candidaturas do candidato:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// get
export const listarCandidatosPorVaga = async (req, res) => {
  try {
    const { idVaga } = req.params;

    const [candidatos] = await pool.query(
      `SELECT c.*, cand.nome, cand.email, cand.telefone, cand.sobreMim
       FROM Candidatura c
       INNER JOIN Candidato cand ON c.idCandidato = cand.idCandidato
       WHERE c.idVaga = ?`,
      [idVaga]
    );

    return res.status(200).json(candidatos);
  } catch (error) {
    console.error("Erro ao listar candidatos da vaga:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// put
export const atualizarStatusCandidatura = async (req, res) => {
  try {
    const { id } = req.params; // idCandidatura
    const { status, observacaoEmpresa } = req.body;

    const [candidaturaExiste] = await pool.query(
      'SELECT * FROM Candidatura WHERE idCandidatura = ?', 
      [id]
    );

    if (candidaturaExiste.length === 0) {
      return res.status(404).json({ erro: "Candidatura não encontrada." });
    }

    const campos = [];
    const valores = [];

    if (status) {
      campos.push('status = ?');
      valores.push(status);
    }

    if (observacaoEmpresa !== undefined) {
      campos.push('observacaoEmpresa = ?');
      valores.push(observacaoEmpresa);
    }

    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
    }

    valores.push(id);

    await pool.query(
      `UPDATE Candidatura SET ${campos.join(', ')} WHERE idCandidatura = ?`,
      valores
    );

    return res.status(200).json({ mensagem: "Candidatura atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar candidatura:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// delete
export const deletarCandidatura = async (req, res) => {
  try {
    const { id } = req.params; // idCandidatura

    const [candidaturaExiste] = await pool.query(
      'SELECT * FROM Candidatura WHERE idCandidatura = ?', 
      [id]
    );

    if (candidaturaExiste.length === 0) {
      return res.status(404).json({ erro: "Candidatura não encontrada." });
    }

    await pool.query('DELETE FROM Candidatura WHERE idCandidatura = ?', [id]);

    return res.status(200).json({ mensagem: "Candidatura cancelada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar candidatura:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
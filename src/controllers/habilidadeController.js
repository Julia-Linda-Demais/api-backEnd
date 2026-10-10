import pool from '../data/bd.js';

// habilidade

//post
export const criarHabilidade = async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "O nome da habilidade é obrigatório." });
    }

    const [habilidadeExiste] = await pool.query(
      'SELECT * FROM Habilidade WHERE nome = ?', 
      [nome]
    );

    if (habilidadeExiste.length > 0) {
      return res.status(409).json({ erro: "Esta habilidade já está cadastrada." });
    }

    const [resultado] = await pool.query(
      'INSERT INTO Habilidade (nome) VALUES (?)',
      [nome]
    );

    return res.status(201).json({
      mensagem: "Habilidade cadastrada com sucesso!",
      habilidade: { idHabilidade: resultado.insertId, nome }
    });
  } catch (error) {
    console.error("Erro ao criar habilidade:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//get
export const listarHabilidades = async (req, res) => {
  try {
    const [habilidades] = await pool.query('SELECT * FROM Habilidade ORDER BY nome ASC');
    return res.status(200).json(habilidades);
  } catch (error) {
    console.error("Erro ao listar habilidades:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//candidato_habilidade

//post
export const adicionarHabilidadeCandidato = async (req, res) => {
  try {
    const { idCandidato, idHabilidade, nivel } = req.body;

    if (!idCandidato || !idHabilidade) {
      return res.status(400).json({ erro: "idCandidato e idHabilidade são obrigatórios." });
    }

    // Vê se já tem alguma associação
    const [associacaoExiste] = await pool.query(
      'SELECT * FROM Candidato_Habilidade WHERE idCandidato = ? AND idHabilidade = ?',
      [idCandidato, idHabilidade]
    );

    if (associacaoExiste.length > 0) {
      return res.status(400).json({ erro: "Esta habilidade já está vinculada a este candidato." });
    }

    await pool.query(
      'INSERT INTO Candidato_Habilidade (idCandidato, idHabilidade, nivel) VALUES (?, ?, ?)',
      [idCandidato, idHabilidade, nivel || null]
    );

    return res.status(201).json({
      mensagem: "Habilidade vinculada ao candidato com sucesso!",
      vinculo: { idCandidato, idHabilidade, nivel: nivel || null }
    });
  } catch (error) {
    console.error("Erro ao vincular habilidade ao candidato:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//get especifico
export const listarHabilidadesPorCandidato = async (req, res) => {
  try {
    const { idCandidato } = req.params;

    const [habilidades] = await pool.query(
      `SELECT h.idHabilidade, h.nome, ch.nivel 
       FROM Candidato_Habilidade ch
       INNER JOIN Habilidade h ON ch.idHabilidade = h.idHabilidade
       WHERE ch.idCandidato = ?`,
      [idCandidato]
    );

    return res.status(200).json(habilidades);
  } catch (error) {
    console.error("Erro ao listar habilidades do candidato:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//put
export const atualizarHabilidadeCandidato = async (req, res) => {
  try {
    const { idCandidato, idHabilidade } = req.params;
    const { nivel } = req.body;

    if (!nivel) {
      return res.status(400).json({ erro: "O campo nível é obrigatório para atualização." });
    }

    const [associacaoExiste] = await pool.query(
      'SELECT * FROM Candidato_Habilidade WHERE idCandidato = ? AND idHabilidade = ?',
      [idCandidato, idHabilidade]
    );

    if (associacaoExiste.length === 0) {
      return res.status(404).json({ erro: "Vinculo entre candidato e habilidade não encontrado." });
    }

    await pool.query(
      'UPDATE Candidato_Habilidade SET nivel = ? WHERE idCandidato = ? AND idHabilidade = ?',
      [nivel, idCandidato, idHabilidade]
    );

    return res.status(200).json({ mensagem: "Nível da habilidade atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar nível da habilidade:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//delete
export const removerHabilidadeCandidato = async (req, res) => {
  try {
    const { idCandidato, idHabilidade } = req.params;

    const [associacaoExiste] = await pool.query(
      'SELECT * FROM Candidato_Habilidade WHERE idCandidato = ? AND idHabilidade = ?',
      [idCandidato, idHabilidade]
    );

    if (associacaoExiste.length === 0) {
      return res.status(404).json({ erro: "Vínculo não encontrado." });
    }

    await pool.query(
      'DELETE FROM Candidato_Habilidade WHERE idCandidato = ? AND idHabilidade = ?',
      [idCandidato, idHabilidade]
    );

    return res.status(200).json({ mensagem: "Habilidade removida do candidato com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover habilidade do candidato:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
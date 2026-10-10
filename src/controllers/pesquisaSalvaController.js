import pool from '../data/bd.js';

//post
export const criarPesquisaSalva = async (req, res) => {
  try {
    const { idCandidato, nomePesquisa, filtros } = req.body;

    if (!idCandidato || !nomePesquisa) {
      return res.status(400).json({ erro: "idCandidato e nomePesquisa são obrigatórios." });
    }

    const [resultado] = await pool.query(
      `INSERT INTO PesquisaSalva 
      (idCandidato, nomePesquisa, filtros, dataCriacao) 
      VALUES (?, ?, ?, NOW())`,
      [
        idCandidato, 
        nomePesquisa, 
        filtros || null
      ]
    );

    return res.status(201).json({
      mensagem: "Pesquisa salva com sucesso!",
      pesquisaSalva: {
        idPesquisa: resultado.insertId,
        idCandidato,
        nomePesquisa,
        filtros,
        dataCriacao: new Date()
      }
    });
  } catch (error) {
    console.error("Erro ao salvar pesquisa:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//get especifico
export const listarPesquisasSalvasPorCandidato = async (req, res) => {
  try {
    const { idCandidato } = req.params;

    const [pesquisas] = await pool.query(
      `SELECT p.*, cand.nome AS candidatoNome 
       FROM PesquisaSalva p
       INNER JOIN Candidato cand ON p.idCandidato = cand.idCandidato
       WHERE p.idCandidato = ? 
       ORDER BY p.dataCriacao DESC`,
      [idCandidato]
    );

    return res.status(200).json(pesquisas);
  } catch (error) {
    console.error("Erro ao listar pesquisas salvas:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//put
export const atualizarPesquisaSalva = async (req, res) => {
  try {
    const { id } = req.params; // idPesquisa
    const dadosAtualizados = req.body;

    const [pesquisaExiste] = await pool.query(
      'SELECT * FROM PesquisaSalva WHERE idPesquisa = ?', 
      [id]
    );

    if (pesquisaExiste.length === 0) {
      return res.status(404).json({ erro: "Pesquisa salva não encontrada." });
    }

    const campos = [];
    const valores = [];

    Object.keys(dadosAtualizados).forEach(chave => {
      campos.push(`${chave} = ?`);
      valores.push(dadosAtualizados[chave]);
    });

    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
    }

    valores.push(id);

    await pool.query(
      `UPDATE PesquisaSalva SET ${campos.join(', ')} WHERE idPesquisa = ?`,
      valores
    );

    return res.status(200).json({ mensagem: "Pesquisa salva atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar pesquisa salva:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//delete
export const deletarPesquisaSalva = async (req, res) => {
  try {
    const { id } = req.params; // idPesquisa

    const [pesquisaExiste] = await pool.query(
      'SELECT * FROM PesquisaSalva WHERE idPesquisa = ?', 
      [id]
    );

    if (pesquisaExiste.length === 0) {
      return res.status(404).json({ erro: "Pesquisa salva não encontrada." });
    }

    await pool.query('DELETE FROM PesquisaSalva WHERE idPesquisa = ?', [id]);

    return res.status(200).json({ mensagem: "Pesquisa salva removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar pesquisa salva:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
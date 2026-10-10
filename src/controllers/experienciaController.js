import pool from '../data/bd.js';

// post
export const criarExperiencia = async (req, res) => {
  try {
    const { 
      idCandidato, 
      empresa, 
      cargo, 
      descricao, 
      periodoInicio, 
      periodoFim 
    } = req.body;

    if (!idCandidato || !empresa || !cargo) {
      return res.status(400).json({ erro: "idCandidato, empresa e cargo são obrigatórios." });
    }

    const [resultado] = await pool.query(
      `INSERT INTO Experiencia 
      (idCandidato, empresa, cargo, descricao, periodoInicio, periodoFim) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        idCandidato, 
        empresa, 
        cargo, 
        descricao || null, 
        periodoInicio || null, 
        periodoFim || null
      ]
    );

    return res.status(201).json({ 
      mensagem: "Experiência cadastrada com sucesso!", 
      experiencia: { 
        idExperiencia: resultado.insertId, 
        idCandidato, 
        empresa, 
        cargo 
      } 
    });
  } catch (error) {
    console.error("Erro ao cadastrar experiência:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//get especifico
export const listarExperienciasPorCandidato = async (req, res) => {
  try {
    const { idCandidato } = req.params;

    const [experiencias] = await pool.query(
      'SELECT * FROM Experiencia WHERE idCandidato = ? ORDER BY periodoInicio DESC', 
      [idCandidato]
    );

    return res.status(200).json(experiencias);
  } catch (error) {
    console.error("Erro ao listar experiências:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//put
export const atualizarExperiencia = async (req, res) => {
  try {
    const { id } = req.params; // idExperiencia
    const dadosAtualizados = req.body;

    const [experienciaExiste] = await pool.query(
      'SELECT * FROM Experiencia WHERE idExperiencia = ?', 
      [id]
    );

    if (experienciaExiste.length === 0) {
      return res.status(404).json({ erro: "Experiência não encontrada." });
    }

    const campos = Object.keys(dadosAtualizados);
    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
    }  //esse Object keys é para listar tds os atributos dessa função

    const valores = campos.map(campo => dadosAtualizados[campo]);
    valores.push(id);

    const setString = campos.map(campo => `${campo} = ?`).join(', ');

    await pool.query(`UPDATE Experiencia SET ${setString} WHERE idExperiencia = ?`, valores);

    return res.status(200).json({ mensagem: "Experiência atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar experiência:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//delete
export const deletarExperiencia = async (req, res) => {
  try {
    const { id } = req.params; // idExperiencia

    const [experienciaExiste] = await pool.query(
      'SELECT * FROM Experiencia WHERE idExperiencia = ?', 
      [id]
    );

    if (experienciaExiste.length === 0) {
      return res.status(404).json({ erro: "Experiência não encontrada." });
    }

    await pool.query('DELETE FROM Experiencia WHERE idExperiencia = ?', [id]);

    return res.status(200).json({ mensagem: "Experiência removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar experiência:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
import pool from '../data/bd.js';

//post
export const criarCurriculo = async (req, res) => {
  try {
    const { 
      idCandidato, 
      objetivo, 
      resumo, 
      curriculoArquivo, 
      curriculoAudio 
    } = req.body;

    if (!idCandidato) {
      return res.status(400).json({ erro: "idCandidato é obrigatório." });
    }

    // Vê se o candidato já tem um currículo feito
    const [curriculoExistente] = await pool.query(
      'SELECT * FROM Curriculo WHERE idCandidato = ?',
      [idCandidato]
    );

    if (curriculoExistente.length > 0) {
      return res.status(400).json({ erro: "Este candidato já possui um currículo cadastrado. Utilize a rota de atualização." });
    }

    const [resultado] = await pool.query(
      `INSERT INTO Curriculo 
      (idCandidato, objetivo, resumo, dataAtualizacao, curriculoArquivo, curriculoAudio) 
      VALUES (?, ?, ?, NOW(), ?, ?)`,
      [
        idCandidato, 
        objetivo || null, 
        resumo || null, 
        curriculoArquivo || null, 
        curriculoAudio || null
      ]
    );

    return res.status(201).json({
      mensagem: "Currículo cadastrado com sucesso!",
      curriculo: {
        idCurriculo: resultado.insertId,
        idCandidato,
        objetivo,
        resumo,
        dataAtualizacao: new Date()
      }
    });
  } catch (error) {
    console.error("Erro ao criar currículo:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// get especifico
export const listarCurriculoPorCandidato = async (req, res) => {
  try {
    const { idCandidato } = req.params;

    const [curriculos] = await pool.query(
      `SELECT c.*, cand.nome, cand.email, cand.telefone, cand.cpf, cand.dataNascimento 
       FROM Curriculo c
       INNER JOIN Candidato cand ON c.idCandidato = cand.idCandidato
       WHERE c.idCandidato = ?`,
      [idCandidato]
    );

    if (curriculos.length === 0) {
      return res.status(404).json({ erro: "Currículo não encontrado para este candidato." });
    }

    return res.status(200).json(curriculos[0]);
  } catch (error) {
    console.error("Erro ao buscar currículo:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//put
export const atualizarCurriculo = async (req, res) => {
  try {
    const { id } = req.params; // idCurriculo
    const dadosAtualizados = req.body;

    const [curriculoExiste] = await pool.query(
      'SELECT * FROM Curriculo WHERE idCurriculo = ?', 
      [id]
    );

    if (curriculoExiste.length === 0) {
      return res.status(404).json({ erro: "Currículo não encontrado." });
    }

    const campos = [];
    const valores = [];

    // Adiciona os campos inseridos
    Object.keys(dadosAtualizados).forEach(chave => {
      campos.push(`${chave} = ?`);
      valores.push(dadosAtualizados[chave]);
    });

    // Atualiza automaticamente a data de atualização
    campos.push('dataAtualizacao = NOW()');

    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
    }

    valores.push(id);

    await pool.query(
      `UPDATE Curriculo SET ${campos.join(', ')} WHERE idCurriculo = ?`,
      valores
    );

    return res.status(200).json({ mensagem: "Currículo atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar currículo:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//delete
export const deletarCurriculo = async (req, res) => {
  try {
    const { id } = req.params; // idCurriculo

    const [curriculoExiste] = await pool.query(
      'SELECT * FROM Curriculo WHERE idCurriculo = ?', 
      [id]
    );

    if (curriculoExiste.length === 0) {
      return res.status(404).json({ erro: "Currículo não encontrado." });
    }

    await pool.query('DELETE FROM Curriculo WHERE idCurriculo = ?', [id]);

    return res.status(200).json({ mensagem: "Currículo removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar currículo:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
import pool from '../data/bd.js';

//vaga

// Criar vaga - POST
export const criarVaga = async (req, res) => {
  try {
    const { 
      idEmpresa, 
      idLocalizacao, 
      titulo, 
      descricao, 
      atividades, 
      requisitos, 
      salario, 
      tipoContratacao, 
      modeloTrabalho, 
      dataEncerramento, 
      status 
    } = req.body;

    if (!titulo || !descricao || !idEmpresa) {
      return res.status(400).json({ erro: "Título, descrição e idEmpresa são obrigatórios." });
    }

    const [resultado] = await pool.query(
      `INSERT INTO Vaga 
      (idEmpresa, idLocalizacao, titulo, descricao, atividades, requisitos, salario, tipoContratacao, modeloTrabalho, dataPublicacao, dataEncerramento, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [
        idEmpresa, 
        idLocalizacao || null, 
        titulo, 
        descricao, 
        atividades || null, 
        requisitos || null, 
        salario || null, 
        tipoContratacao || null, 
        modeloTrabalho || null, 
        dataEncerramento || null, 
        status || "Ativa"
      ]
    );

    return res.status(201).json({ 
      mensagem: "Vaga criada com sucesso!", 
      vaga: { idVaga: resultado.insertId, titulo, idEmpresa } 
    });
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// Listar vagas - GET
export const listarVagas = async (req, res) => {
  try {
    const [vagas] = await pool.query('SELECT * FROM Vaga');
    return res.status(200).json(vagas);
  } catch (error) {
    console.error("Erro ao listar vagas:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// Atualizar vaga - PUT
export const atualizarVaga = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    const [vagaExiste] = await pool.query('SELECT * FROM Vaga WHERE idVaga = ?', [id]);
    if (vagaExiste.length === 0) {
      return res.status(404).json({ erro: "Vaga não encontrada." });
    }

    // Monta dinamicamente a query de atualização com base nos campos enviados
    const campos = Object.keys(dadosAtualizados);
    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum dado fornecido para atualização." });
    }

    const valores = campos.map(campo => dadosAtualizados[campo]);
    valores.push(id);

    const setString = campos.map(campo => `${campo} = ?`).join(', ');

    await pool.query(`UPDATE Vaga SET ${setString} WHERE idVaga = ?`, valores);

    return res.status(200).json({ mensagem: "Vaga atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar vaga:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// Deletar vaga - DELETE
export const deletarVaga = async (req, res) => {
  try {
    const { id } = req.params;

    const [vagaExiste] = await pool.query('SELECT * FROM Vaga WHERE idVaga = ?', [id]);
    if (vagaExiste.length === 0) {
      return res.status(404).json({ erro: "Vaga não encontrada." });
    }

    await pool.query('DELETE FROM Vaga WHERE idVaga = ?', [id]);

    return res.status(200).json({ mensagem: "Vaga removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar vaga:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//vaga favorita

// Favoritar vaga - POST
export const favoritarVaga = async (req, res) => {
  try {
    const { idCandidato, idVaga } = req.body;

    if (!idCandidato || !idVaga) {
      return res.status(400).json({ erro: "idCandidato e idVaga são obrigatórios." });
    }

    const [jaFavoritado] = await pool.query(
      'SELECT * FROM VagaFavorita WHERE idCandidato = ? AND idVaga = ?', 
      [idCandidato, idVaga]
    );

    if (jaFavoritado.length > 0) {
      return res.status(400).json({ erro: "Esta vaga já está favoritada." });
    }

    const [resultado] = await pool.query(
      'INSERT INTO VagaFavorita (idCandidato, idVaga, dataSalvamento) VALUES (?, ?, NOW())',
      [idCandidato, idVaga]
    );

    return res.status(201).json({ 
      mensagem: "Vaga favoritada com sucesso!", 
      favorito: { idFavorita: resultado.insertId, idCandidato, idVaga } 
    });
  } catch (error) {
    console.error("Erro ao favoritar vaga:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// Listar favoritas do candidato - GET
export const listarFavoritas = async (req, res) => {
  try {
    const { idCandidato } = req.params;

    const [favoritas] = await pool.query(
      `SELECT vf.*, v.* FROM VagaFavorita vf 
       INNER JOIN Vaga v ON vf.idVaga = v.idVaga 
       WHERE vf.idCandidato = ?`, 
      [idCandidato]
    );

    return res.status(200).json(favoritas);
  } catch (error) {
    console.error("Erro ao listar vagas favoritas:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

// Desfavoritar / deletar dos favoritos a vaga - DELETE
export const desfavoritarVaga = async (req, res) => {
  try {
    const { id } = req.params; // idFavorita

    const [favoritoExiste] = await pool.query('SELECT * FROM VagaFavorita WHERE idFavorita = ?', [id]);
    if (favoritoExiste.length === 0) {
      return res.status(404).json({ erro: "Favorito não encontrado." });
    }

    await pool.query('DELETE FROM VagaFavorita WHERE idFavorita = ?', [id]);

    return res.status(200).json({ mensagem: "Vaga removida dos favoritos com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
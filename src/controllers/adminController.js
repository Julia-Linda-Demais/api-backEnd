import pool from '../data/bd.js'; 

export const registrarAdmin = async (req, res) => {
  try {
    const { nome, email, senha, nivelAcesso } = req.body;
    
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, E-mail e Senha são obrigatórios." });
    }

    const [adminExiste] = await pool.query('SELECT * FROM Administrador WHERE email = ?', [email]);
    if (adminExiste.length > 0) {
      return res.status(409).json({ erro: "Este e-mail já está cadastrado." });
    }

    const [resultado] = await pool.query(
      'INSERT INTO Administrador (nome, email, senha, nivelAcesso, status, dataCadastro) VALUES (?, ?, ?, ?, ?, NOW())',
      [nome, email, senha, nivelAcesso || "PADRAO", "ATIVO"]
    );

    return res.status(201).json({
      mensagem: "Administrador cadastrado com sucesso!",
      admin: { idAdministrador: resultado.insertId, nome }
    });
  } catch (error) {
    console.error("Erro ao registrar admin:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
    }

    const [admins] = await pool.query(
      'SELECT * FROM Administrador WHERE email = ? AND senha = ?', 
      [email, senha]
    );

    if (admins.length === 0) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    const admin = admins[0];

    return res.status(200).json({
      mensagem: "Login efetuado com sucesso!",
      admin: { idAdministrador: admin.idAdministrador, nome: admin.nome }
    });
  } catch (error) {
    console.error("Erro no login do admin:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

export const listarAdmins = async (req, res) => {
  try {
    const [admins] = await pool.query('SELECT idAdministrador, nome, email, nivelAcesso, status, dataCadastro FROM Administrador');
    return res.status(200).json(admins);
  } catch (error) {
    console.error("Erro ao listar admins:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//get especifico
export const buscarAdminPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [admins] = await pool.query(
      'SELECT idAdministrador, nome, email, nivelAcesso, status, dataCadastro FROM Administrador WHERE idAdministrador = ?', 
      [id]
    );

    if (admins.length === 0) {
      return res.status(404).json({ erro: "Administrador não encontrado." });
    }

    return res.status(200).json(admins[0]);
  } catch (error) {
    console.error("Erro ao buscar administrador:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//put
export const atualizarAdmin = async (req, res) => {
  try {
    const { id } = req.params; // idAdministrador
    const dadosAtualizados = req.body;

    const [adminExiste] = await pool.query('SELECT * FROM Administrador WHERE idAdministrador = ?', [id]);
    if (adminExiste.length === 0) {
      return res.status(404).json({ erro: "Administrador não encontrado." });
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
      `UPDATE Administrador SET ${campos.join(', ')} WHERE idAdministrador = ?`,
      valores
    );

    return res.status(200).json({ mensagem: "Administrador atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar administrador:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//delete
export const deletarAdmin = async (req, res) => {
  try {
    const { id } = req.params; // idAdministrador

    const [adminExiste] = await pool.query('SELECT * FROM Administrador WHERE idAdministrador = ?', [id]);
    if (adminExiste.length === 0) {
      return res.status(404).json({ erro: "Administrador não encontrado." });
    }

    await pool.query('DELETE FROM Administrador WHERE idAdministrador = ?', [id]);

    return res.status(200).json({ mensagem: "Administrador removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar administrador:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
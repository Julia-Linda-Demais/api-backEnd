import pool from '../data/bd.js'; 

export const registrarCandidato = async (req, res) => {
  try {
    // 1. Receber TODOS os campos necessários do req.body
    const { nome, email, telefone, senha, dataNascimento, idLocalizacao, sobreMim } = req.body;
    
    // 2. Validar os campos obrigatórios (baseado na estrutura da sua tabela)
    if (!nome || !email || !senha || !idLocalizacao) {
      return res.status(400).json({ erro: "Nome, email, senha e idLocalizacao são campos obrigatórios." });
    }
    
    // 3. Verificar se o telefone já existe
    if (telefone) {
      const [telefoneExiste] = await pool.query('SELECT * FROM Candidato WHERE telefone = ?', [telefone]);
      if (telefoneExiste.length > 0) {
        return res.status(409).json({ erro: "Este telefone já está cadastrado." });
      }
    }

    // Opcional, mas recomendado: Verificar se o email já existe
    const [emailExiste] = await pool.query('SELECT * FROM Candidato WHERE email = ?', [email]);
    if (emailExiste.length > 0) {
      return res.status(409).json({ erro: "Este email já está cadastrado." });
    }
    
    // 4. Inserir TODOS os campos na query SQL
    const [resultado] = await pool.query(
      `INSERT INTO Candidato 
      (nome, email, telefone, dataNascimento, senha, idLocalizacao, sobreMim, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, email, telefone, dataNascimento, senha, idLocalizacao, sobreMim, "ATIVO"]
    );

    return res.status(201).json({ 
      mensagem: "Cadastro realizado com sucesso!", 
      candidato: { idCandidato: resultado.insertId, nome } 
    });
  } catch (error) {
    console.error("Erro ao registrar candidato:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

export const loginCandidato = async (req, res) => {
  try {
    const { telefone, senha } = req.body;

    if (!telefone || !senha) {
      return res.status(400).json({ erro: "Telefone e senha são obrigatórios." });
    }

    const [candidatos] = await pool.query(
      'SELECT * FROM Candidato WHERE telefone = ? AND senha = ?', 
      [telefone, senha]
    );

    if (candidatos.length === 0) {
      return res.status(401).json({ erro: "Telefone ou senha inválidos." });
    }

    const candidato = candidatos[0];

    return res.status(200).json({ 
      mensagem: "Login efetuado com sucesso!", 
      candidato: { idCandidato: candidato.idCandidato, nome: candidato.nome } 
    });
  } catch (error) {
    console.error("Erro no login do candidato:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

export const listarCandidatos = async (req, res) => {
  try {
    const [candidatos] = await pool.query('SELECT idCandidato, nome, email, telefone, dataNascimento, status FROM Candidato');
    return res.status(200).json(candidatos);
  } catch (error) {
    console.error("Erro ao listar candidatos:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//put
export const atualizarCandidato = async (req, res) => {
  try {
    const { id } = req.params; // idCandidato
    const dadosAtualizados = req.body;

    
    const [candidatoExiste] = await pool.query('SELECT * FROM Candidato WHERE idCandidato = ?', [id]);
    if (candidatoExiste.length === 0) {
      return res.status(404).json({ erro: "Candidato não encontrado." });
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
      `UPDATE Candidato SET ${campos.join(', ')} WHERE idCandidato = ?`,
      valores
    );

    return res.status(200).json({ mensagem: "Candidato atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar candidato:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//delete
export const deletarCandidato = async (req, res) => {
  try {
    const { id } = req.params; // idCandidato

    const [candidatoExiste] = await pool.query('SELECT * FROM Candidato WHERE idCandidato = ?', [id]);
    if (candidatoExiste.length === 0) {
      return res.status(404).json({ erro: "Candidato não encontrado." });
    }

    await pool.query('DELETE FROM Candidato WHERE idCandidato = ?', [id]);

    return res.status(200).json({ mensagem: "Candidato removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar candidato:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
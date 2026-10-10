import pool from '../data/bd.js'; 

export const registrarEmpresa = async (req, res) => {
  try {
    const { cnpj, senha, razaoSocial, segmento, telefone, email, nomeFantasia, idLocalizacao, sobreEmpresa } = req.body;
      
    if (!cnpj || !senha || !razaoSocial) {
      return res.status(400).json({ erro: "CNPJ, Senha e Razão Social são obrigatórios." });
    }

    const [empresaExiste] = await pool.query('SELECT * FROM Empresa WHERE cnpj = ?', [cnpj]);
    if (empresaExiste.length > 0) {
      return res.status(409).json({ erro: "Este CNPJ já está cadastrado." });
    }

    const [resultado] = await pool.query(
      `INSERT INTO Empresa 
      (cnpj, senha, razaoSocial, nomeFantasia, segmento, telefone, email, idLocalizacao, sobreEmpresa, status, dateCadastro) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        cnpj, 
        senha, 
        razaoSocial, 
        nomeFantasia || null, 
        segmento || null, 
        telefone || null, 
        email || null, 
        idLocalizacao || null, 
        sobreEmpresa || null, 
        "ATIVO"
      ]
    );

    return res.status(201).json({  
      mensagem: "Empresa cadastrada com sucesso!",  
      empresa: { idEmpresa: resultado.insertId, razaoSocial }
    });
  } catch (error) {
    console.error("Erro ao registrar empresa:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

export const loginEmpresa = async (req, res) => {
  try {
    const { cnpj, senha } = req.body;

    if (!cnpj || !senha) {
      return res.status(400).json({ erro: "CNPJ e senha são obrigatórios." });
    }

    const [empresas] = await pool.query(
      'SELECT * FROM Empresa WHERE cnpj = ? AND senha = ?', 
      [cnpj, senha]
    );

    if (empresas.length === 0) {
      return res.status(401).json({ erro: "CNPJ ou senha inválidos." });
    }

    const empresa = empresas[0];

    return res.status(200).json({  
      mensagem: "Login efetuado com sucesso!",  
      empresa: { idEmpresa: empresa.idEmpresa, razaoSocial: empresa.razaoSocial }
    });
  } catch (error) {
    console.error("Erro no login da empresa:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

export const listarEmpresas = async (req, res) => {
  try {
    const [empresas] = await pool.query('SELECT idEmpresa, cnpj, razaoSocial, nomeFantasia, segmento, telefone, email, status FROM Empresa');
    return res.status(200).json(empresas);
  } catch (error) {
    console.error("Erro ao listar empresas:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//get especifico
export const buscarEmpresaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [empresas] = await pool.query('SELECT idEmpresa, cnpj, razaoSocial, nomeFantasia, segmento, telefone, email, idLocalizacao, sobreEmpresa, status, dateCadastro FROM Empresa WHERE idEmpresa = ?', [id]);

    if (empresas.length === 0) {
      return res.status(404).json({ erro: "Empresa não encontrada." });
    }

    return res.status(200).json(empresas[0]);
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//put
export const atualizarEmpresa = async (req, res) => {
  try {
    const { id } = req.params; // idEmpresa
    const dadosAtualizados = req.body;

    const [empresaExiste] = await pool.query('SELECT * FROM Empresa WHERE idEmpresa = ?', [id]);
    if (empresaExiste.length === 0) {
      return res.status(404).json({ erro: "Empresa não encontrada." });
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
      `UPDATE Empresa SET ${campos.join(', ')} WHERE idEmpresa = ?`,
      valores
    );

    return res.status(200).json({ mensagem: "Empresa atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//delete
export const deletarEmpresa = async (req, res) => {
  try {
    const { id } = req.params; // idEmpresa

    const [empresaExiste] = await pool.query('SELECT * FROM Empresa WHERE idEmpresa = ?', [id]);
    if (empresaExiste.length === 0) {
      return res.status(404).json({ erro: "Empresa não encontrada." });
    }

    await pool.query('DELETE FROM Empresa WHERE idEmpresa = ?', [id]);

    return res.status(200).json({ mensagem: "Empresa removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar empresa:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
import pool from '../data/bd.js';

//post
export const criarLocalizacao = async (req, res) => {
  try {
    const { 
      cep, 
      estado, 
      cidade, 
      bairro, 
      logradouro, 
      numero, 
      complemento,
      latitude,  // Campo opcional para geolocalização
      longitude  // Campo opcional para geolocalização
    } = req.body;

    if (!cidade || !estado) {
      return res.status(400).json({ erro: "Cidade e estado são obrigatórios." });
    }

    const [resultado] = await pool.query(
      `INSERT INTO Localizacao 
      (cep, estado, cidade, bairro, logradouro, numero, complemento) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cep || null, 
        estado, 
        cidade, 
        bairro || null, 
        logradouro || null, 
        numero || null, 
        complemento || null
      ]
    );

    return res.status(201).json({
      mensagem: "Localização cadastrada com sucesso!",
      localizacao: {
        idLocalizacao: resultado.insertId,
        cep,
        estado,
        cidade,
        bairro,
        logradouro,
        numero,
        complemento,
        latitude: latitude || null,
        longitude: longitude || null
      }
    });
  } catch (error) {
    console.error("Erro ao cadastrar localização:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//get
export const listarLocalizacoes = async (req, res) => {
  try {
    const [localizacoes] = await pool.query('SELECT * FROM Localizacao');
    return res.status(200).json(localizacoes);
  } catch (error) {
    console.error("Erro ao listar localizações:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//get especifico
export const buscarLocalizacaoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [localizacao] = await pool.query('SELECT * FROM Localizacao WHERE idLocalizacao = ?', [id]);

    if (localizacao.length === 0) {
      return res.status(404).json({ erro: "Localização não encontrada." });
    }

    return res.status(200).json(localizacao[0]);
  } catch (error) {
    console.error("Erro ao buscar localização:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//put
export const atualizarLocalizacao = async (req, res) => {
  try {
    const { id } = req.params; // idLocalizacao
    const dadosAtualizados = req.body;

    const [localizacaoExiste] = await pool.query(
      'SELECT * FROM Localizacao WHERE idLocalizacao = ?', 
      [id]
    );

    if (localizacaoExiste.length === 0) {
      return res.status(404).json({ erro: "Localização não encontrada." });
    }

    const campos = [];
    const valores = [];

    // Ignora latitude e longitude caso não pertençam às colunas físicas originais do banco, 
    // ou remova essa restrição se preferir criar as colunas de coordenadas na tabela.
    Object.keys(dadosAtualizados).forEach(chave => {
      if (chave !== 'latitude' && chave !== 'longitude') {
        campos.push(`${chave} = ?`);
        valores.push(dadosAtualizados[chave]);
      }
    });

    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum dado válido fornecido para atualização." });
    }

    valores.push(id);

    await pool.query(
      `UPDATE Localizacao SET ${campos.join(', ')} WHERE idLocalizacao = ?`,
      valores
    );

    return res.status(200).json({ mensagem: "Localização atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar localização:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

//delete
export const deletarLocalizacao = async (req, res) => {
  try {
    const { id } = req.params; // idLocalizacao

    const [localizacaoExiste] = await pool.query(
      'SELECT * FROM Localizacao WHERE idLocalizacao = ?', 
      [id]
    );

    if (localizacaoExiste.length === 0) {
      return res.status(404).json({ erro: "Localização não encontrada." });
    }

    await pool.query('DELETE FROM Localizacao WHERE idLocalizacao = ?', [id]);

    return res.status(200).json({ mensagem: "Localização removida com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar localização:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
};
const pool = require('../models/db');

async function criarMateria(req, res) {
    const { nome_materia, tipo_materia, progresso } = req.body;
    
    // Pega o ID do usuário do token
    const id_usuario = req.usuario.id_usuario;

    if (!nome_materia || !tipo_materia) {
        return res.status(400).json({ error: 'Os campos "nome_materia" e "tipo_materia" são obrigatórios.' });
    }

    const sql = `
        INSERT INTO materia (nome_materia, tipo_materia, progresso, usuario_id)
        VALUES (?, ?, ?, ?)
    `;

    try {
        const [result] = await pool.execute(sql, [nome_materia, tipo_materia, progresso || 0, id_usuario]);

        res.status(201).json({
            message: 'Matéria criada com sucesso!',
            id_materia: result.insertId,
            nome_materia,
            tipo_materia,
            usuario_id: id_usuario
        });
    } catch (err) {
        if (err.errno === 1062) {
            return res.status(409).json({ error: 'Esta matéria já está cadastrada.' });
        }
        console.error('Erro ao criar matéria:', err);
        res.status(500).json({ error: 'Erro interno no servidor ao criar matéria.' });
    }
}

async function listarMaterias(req, res) {
    const id_usuario = req.usuario.id_usuario;
    const sql = 'SELECT * FROM materia WHERE usuario_id = ?';
    
    try {
        const [rows] = await pool.execute(sql, [id_usuario]);
        res.json(rows);
    } catch (err) {
        console.error('Erro ao listar matérias:', err);
        res.status(500).json({ error: 'Erro interno ao listar matérias.' });
    }
}

module.exports = {
    criarMateria,
    listarMaterias
};
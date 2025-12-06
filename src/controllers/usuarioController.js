const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- LÓGICA DE USUÁRIO ---

async function criarUsuario(req, res) {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'Preencha todos os campos.' });

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const sql = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)';
        const [result] = await pool.execute(sql, [nome, email, senhaHash]);
        res.status(201).json({ message: 'Usuário criado!', id_usuario: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email já em uso.' });
        res.status(500).json({ error: 'Erro interno.' });
    }
}

async function loginUsuario(req, res) {
    const { email, senha } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM usuario WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Usuário não encontrado.' });

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta.' });

        const token = jwt.sign({ id_usuario: usuario.id_usuario }, process.env.JWT_SECRET || 'segredo123', { expiresIn: '2h' });
        res.json({ message: 'Login sucesso', token, usuario: { id: usuario.id_usuario, nome: usuario.nome } });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno.' });
    }
}

async function listarUsuarios(req, res) {
    try {
        const [rows] = await pool.execute('SELECT id_usuario, nome, email FROM usuario');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Erro ao listar usuários' }); }
}

async function getPerfilUsuario(req, res) {
    const id = req.usuario.id_usuario;
    try {
        const [rows] = await pool.execute('SELECT id_usuario, nome, email, preferencia_tema FROM usuario WHERE id_usuario = ?', [id]);
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: 'Erro ao buscar perfil' }); }
}

async function updatePerfilUsuario(req, res) {
    const id = req.usuario.id_usuario;
    const { nome, email } = req.body;
    try {
        await pool.execute('UPDATE usuario SET nome = ?, email = ? WHERE id_usuario = ?', [nome, email, id]);
        res.json({ message: 'Perfil atualizado' });
    } catch (err) { res.status(500).json({ error: 'Erro ao atualizar' }); }
}

async function updateAparenciaUsuario(req, res) {
    const id = req.usuario.id_usuario;
    const { tema } = req.body;
    try {
        await pool.execute('UPDATE usuario SET preferencia_tema = ? WHERE id_usuario = ?', [tema, id]);
        res.json({ message: 'Tema atualizado' });
    } catch (err) { res.status(500).json({ error: 'Erro ao atualizar tema' }); }
}

// --- LÓGICA DE FLASHCARDS (MISTURADA AQUI COMO PEDIDO) ---

async function criarFlashcard(req, res) {
    const { pergunta, resposta, materia_id } = req.body;
    if (!pergunta || !resposta || !materia_id) return res.status(400).json({ error: 'Dados incompletos.' });

    try {
        const sql = 'INSERT INTO flashcard (pergunta, resposta, materia_id) VALUES (?, ?, ?)';
        const [result] = await pool.execute(sql, [pergunta, resposta, materia_id]);
        res.status(201).json({ message: 'Flashcard criado', id_flashcard: result.insertId });
    } catch (err) { 
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar card' }); 
    }
}

async function listarFlashcards(req, res) {
    const { id_materia } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM flashcard WHERE materia_id = ?', [id_materia]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Erro ao listar cards' }); }
}

module.exports = {
    criarUsuario,
    loginUsuario,
    listarUsuarios,
    getPerfilUsuario,
    updatePerfilUsuario,
    updateAparenciaUsuario,
    criarFlashcard,
    listarFlashcards
};
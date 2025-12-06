const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Pega o token do cabeçalho 'Authorization'
    const authHeader = req.headers['authorization'];
    // O formato é "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'segredo123';
        
        // Verifica o token e anexa o payload (que contém id_usuario, nome, email) ao req
        req.usuario = jwt.verify(token, secret);
        
        // Continua para a próxima função (o controller)
        next();
    } catch (err) {
        console.error("Token inválido:", err.message);
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
}

module.exports = authMiddleware;
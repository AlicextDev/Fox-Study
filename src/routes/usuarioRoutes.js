const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', usuarioController.criarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.get('/perfil', authMiddleware, usuarioController.getPerfilUsuario);
router.put('/perfil', authMiddleware, usuarioController.updatePerfilUsuario);
router.put('/aparencia', authMiddleware, usuarioController.updateAparenciaUsuario);
router.get('/', usuarioController.listarUsuarios);
router.post('/flashcards', authMiddleware, usuarioController.criarFlashcard);
router.get('/flashcards/:id_materia', authMiddleware, usuarioController.listarFlashcards);

module.exports = router;
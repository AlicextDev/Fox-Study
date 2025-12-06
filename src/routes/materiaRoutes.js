const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materiaController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.post('/', materiaController.criarMateria);
router.get('/', materiaController.listarMaterias);

module.exports = router;
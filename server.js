const express = require('express');
const path = require('path');
const cors = require('cors');
require('./src/models/db');

const usuarioRoutes = require('./src/routes/usuarioRoutes'); 
const materiaRoutes = require('./src/routes/materiaRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'Front-end')));
app.use('/api/materia', materiaRoutes);
app.use('/api/usuario', usuarioRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Front-end', 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
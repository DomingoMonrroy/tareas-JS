import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

// Configuración de Sequelize usando las variables de entorno (.env)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false // Evita que la consola se llene de mensajes de consultas SQL
  }
);

// Definición del Modelo (Esto creará automáticamente la tabla 'clientes')
const Cliente = sequelize.define('Cliente', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
}, { 
  tableName: 'clientes', 
  timestamps: false 
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Sirve los archivos de la carpeta public

// GET: Devolver todos los clientes
app.get('/clientes', async (_req, res) => {
  try {
    const rows = await Cliente.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// POST: Crear un nuevo cliente
app.post('/clientes', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const creado = await Cliente.create({ nombre, email });
    res.status(201).json(creado);
  } catch (e) {
    res.status(400).json({ ok: false, mensaje: e.message });
  }
});

// Inicializar base de datos y arrancar servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente con Sequelize.');
    await sequelize.sync(); // Magia: crea la tabla en la base de datos si no existe
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor API corriendo en http://localhost:${PORT}`));
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
})();
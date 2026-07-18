import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

// 1. Configuración de conexión a PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false // Mantiene la terminal limpia
  }
);

// 2. Definición de Modelos
const Pelicula = sequelize.define('Pelicula', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  anio: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'peliculas', timestamps: false });

const Actor = sequelize.define('Actor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false }
}, { tableName: 'actores', timestamps: false });

// Tabla Intermedia
const PeliculasActores = sequelize.define('PeliculasActores', {}, {
  tableName: 'peliculas_actores', timestamps: false
});

// 3. Relaciones Muchos a Muchos (N-N)
Pelicula.belongsToMany(Actor, { through: PeliculasActores, foreignKey: 'pelicula_id', otherKey: 'actor_id' });
Actor.belongsToMany(Pelicula, { through: PeliculasActores, foreignKey: 'actor_id', otherKey: 'pelicula_id' });

// 4. Configuración del Servidor Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Conecta con nuestro index.html

// ==========================================
// RUTAS API
// ==========================================

// Obtener todas las películas y sus actores asignados
app.get('/peliculas', async (req, res) => {
  try {
    const peliculas = await Pelicula.findAll({ include: { model: Actor, through: { attributes: [] } } });
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva película
app.post('/peliculas', async (req, res) => {
  try {
    const pelicula = await Pelicula.create(req.body);
    res.status(201).json(pelicula);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los actores y sus películas asignadas
app.get('/actores', async (req, res) => {
  try {
    const actores = await Actor.findAll({ include: { model: Pelicula, through: { attributes: [] } } });
    res.json(actores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo actor
app.post('/actores', async (req, res) => {
  try {
    const actor = await Actor.create(req.body);
    res.status(201).json(actor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// RUTA TRANSACCIONAL: Asignar un actor a una película
app.post('/asignar-actor', async (req, res) => {
  const { pelicula_id, actor_id } = req.body;
  
  if (!pelicula_id || !actor_id) {
      return res.status(400).json({ error: 'Faltan IDs para realizar la asignación' });
  }

  try {
    // Iniciamos la transacción gestionada por Sequelize
    await sequelize.transaction(async (t) => {
      await PeliculasActores.create({ pelicula_id, actor_id }, { transaction: t });
      // Cualquier otra operación dentro de este bloque respetará la transacción (COMMIT / ROLLBACK automático)
    });
    
    res.status(201).json({ mensaje: '¡Actor asignado exitosamente a la película mediante transacción!' });
  } catch (error) {
    res.status(400).json({ error: 'Fallo en la transacción: ' + error.message });
  }
});

// ==========================================
// INICIALIZACIÓN
// ==========================================
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Crea automáticamente las 3 tablas si no existen
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor de Películas corriendo en http://localhost:${PORT}`));
  } catch (error) {
    console.error('Error crítico:', error);
  }
})();
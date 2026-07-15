const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de tu base de datos
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Cambia esto si tu base de datos tiene otro nombre
    password: '1855', 
    port: 5432,
});

// GET /conductores
app.get('/conductores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM conductores');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /automoviles
app.get('/automoviles', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM automoviles');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /conductoressinauto?edad=<numero>
app.get('/conductoressinauto', async (req, res) => {
    const { edad } = req.query;
    try {
        const query = `
            SELECT c.nombre, c.edad 
            FROM conductores c 
            LEFT JOIN automoviles a ON c.nombre = a.nombre_conductor 
            WHERE a.patente IS NULL AND c.edad < $1
        `;
        const result = await pool.query(query, [edad]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /solitos
app.get('/solitos', async (req, res) => {
    try {
        const query = `
            SELECT c.nombre AS conductor, c.edad, a.marca, a.patente 
            FROM conductores c 
            FULL OUTER JOIN automoviles a ON c.nombre = a.nombre_conductor 
            WHERE a.patente IS NULL OR c.nombre IS NULL
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /auto?patente=<string> o /auto?iniciopatente=<letra>
app.get('/auto', async (req, res) => {
    const { patente, iniciopatente } = req.query;
    try {
        if (patente) {
            const query = `
                SELECT a.marca, a.patente, c.nombre, c.edad 
                FROM automoviles a 
                LEFT JOIN conductores c ON a.nombre_conductor = c.nombre 
                WHERE a.patente = $1
            `;
            const result = await pool.query(query, [patente]);
            res.status(result.rows.length ? 200 : 404).json(result.rows);
        } else if (iniciopatente) {
            const query = `
                SELECT a.marca, a.patente, c.nombre, c.edad 
                FROM automoviles a 
                LEFT JOIN conductores c ON a.nombre_conductor = c.nombre 
                WHERE a.patente LIKE $1
            `;
            const result = await pool.query(query, [`${iniciopatente}%`]);
            res.status(result.rows.length ? 200 : 404).json(result.rows);
        } else {
            res.status(400).json({ error: 'Falta parámetro' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
});
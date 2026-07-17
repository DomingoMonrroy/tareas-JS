require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Aquí serviremos el frontend más adelante

// Configuración de la conexión a PostgreSQL usando las variables del .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

// ==========================================
// RUTAS GET: Consultas con filtros
// ==========================================
app.get('/api/datos', async (req, res) => {
    const { filtro, id, orden, rut } = req.query;

    try {
        let query = '';
        let values = [];

        // 1. Filtro: Productos
        if (filtro === 'productos') {
            if (id) {
                query = 'SELECT * FROM productos WHERE id_producto = $1';
                values = [id];
            } else if (orden) {
                query = `SELECT p.*, lp.cantidad_producto 
                         FROM productos p 
                         JOIN lista_productos lp ON p.id_producto = lp.id_producto 
                         WHERE lp.id_orden = $1`;
                values = [orden];
            } else {
                query = 'SELECT * FROM productos';
            }
        } 
        // 2. Filtro: Órdenes
        else if (filtro === 'ordenes') {
            if (rut) {
                query = 'SELECT * FROM orden WHERE rut = $1';
                values = [rut];
            }
        } 
        // 3. Filtro: Clientes
        else if (filtro === 'clientes') {
            if (rut) {
                query = 'SELECT * FROM clientes WHERE rut = $1';
                values = [rut];
            } else {
                query = 'SELECT * FROM clientes';
            }
        } 
        // 4. Filtro: Direcciones
        else if (filtro === 'direcciones') {
            if (rut) {
                query = 'SELECT * FROM direcciones WHERE rut = $1';
                values = [rut];
            }
        } 
        // 5. Filtro: Despachos
        else if (filtro === 'despachos') {
            if (orden) {
                query = 'SELECT * FROM despachos WHERE id_orden = $1';
                values = [orden];
            }
        } else {
            return res.status(400).json({ error: 'Filtro no válido o ausente' });
        }

        const { rows } = await pool.query(query, values);
        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al consultar la base de datos' });
    }
});

// ==========================================
// RUTA POST: Transacción de Orden de Compra
// ==========================================
app.post('/orden', async (req, res) => {
    const { rut, id_direccion, carrito } = req.body; 
    // "carrito" será un arreglo de objetos: [{ id_producto: 1, cantidad: 2 }, ...]

    if (!rut || !id_direccion || !carrito || carrito.length === 0) {
        return res.status(400).json({ ok: false, mensaje: 'Faltan datos requeridos para la orden' });
    }

    const client = await pool.connect();

    try {
        // Iniciamos la transacción
        await client.query('BEGIN');

        let precio_total = 0;

        // 1. Validar stock de cada producto y calcular el precio total
        for (let item of carrito) {
            // Restamos el stock inmediatamente
            const updateStockQuery = `
                UPDATE productos 
                SET existencias = existencias - $1 
                WHERE id_producto = $2 
                RETURNING nombre, precio, existencias
            `;
            const resultStock = await client.query(updateStockQuery, [item.cantidad, item.id_producto]);

            if (resultStock.rows.length === 0) {
                throw new Error(`El producto con ID ${item.id_producto} no existe.`);
            }

            const productoBD = resultStock.rows[0];

            // Si el stock quedó en negativo, lanzamos un error que gatillará el ROLLBACK
            if (productoBD.existencias < 0) {
                throw new Error(`Falta de stock para el producto: ${productoBD.nombre}. Stock actual insuficiente.`);
            }

            // Sumamos al total
            precio_total += (productoBD.precio * item.cantidad);
        }

        // 2. Insertar la orden
        const insertOrdenQuery = `
            INSERT INTO orden (rut, id_direccion, precio_total) 
            VALUES ($1, $2, $3) RETURNING id_orden
        `;
        const resultOrden = await client.query(insertOrdenQuery, [rut, id_direccion, precio_total]);
        const id_orden = resultOrden.rows[0].id_orden;

        // 3. Insertar la lista de productos de esa orden
        for (let item of carrito) {
            const insertListaQuery = `
                INSERT INTO lista_productos (id_orden, id_producto, cantidad_producto) 
                VALUES ($1, $2, $3)
            `;
            await client.query(insertListaQuery, [id_orden, item.id_producto, item.cantidad]);
        }

        // 4. Insertar el despacho
        const insertDespachoQuery = `
            INSERT INTO despachos (id_orden, id_direccion) 
            VALUES ($1, $2)
        `;
        await client.query(insertDespachoQuery, [id_orden, id_direccion]);

        // Si todo salió bien hasta aquí, guardamos los cambios definitivamente
        await client.query('COMMIT');
        res.status(201).json({ ok: true, mensaje: 'Orden creada exitosamente', id_orden: id_orden });

    } catch (error) {
        // Si algo falló (ej: stock < 0), deshacemos todos los cambios
        await client.query('ROLLBACK');
        res.status(409).json({ ok: false, mensaje: error.message });
    } finally {
        // Liberamos el cliente para que no se sature la base de datos
        client.release();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Órdenes corriendo en http://localhost:${PORT}`);
});
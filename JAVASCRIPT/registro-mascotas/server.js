const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dataPath = path.join(__dirname, 'mascotas.json');

// --- Funciones auxiliares para no repetir código ---
async function leerDatos() {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
}

async function guardarDatos(datos) {
    await fs.writeFile(dataPath, JSON.stringify(datos, null, 2));
}

// 1. GET sin parámetros: Retornar todas las mascotas con su correspondiente dueño.
app.get('/api/mascotas', async (req, res) => {
    try {
        const mascotas = await leerDatos();
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({ error: "Error al leer los registros" });
    }
});

// 2. GET con el parámetro nombre: Retornar la mascota con ese nombre y el rut de su dueño.
app.get('/api/mascotas/nombre/:nombre', async (req, res) => {
    try {
        const mascotas = await leerDatos();
        const mascota = mascotas.find(m => m.nombre.toLowerCase() === req.params.nombre.toLowerCase());
        
        if (!mascota) return res.status(404).json({ error: "Mascota no encontrada en el registro" });
        res.json(mascota);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 3. GET con el parámetro rut: Retornar todas las mascotas asociadas a ese rut.
app.get('/api/mascotas/rut/:rut', async (req, res) => {
    try {
        const mascotas = await leerDatos();
        const filtradas = mascotas.filter(m => m.rut === req.params.rut);
        
        if (filtradas.length === 0) return res.status(404).json({ error: "No hay mascotas asociadas a este RUT" });
        res.json(filtradas);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 4. POST: Inserta una mascota al archivo.
app.post('/api/mascotas', async (req, res) => {
    const { nombre, rut } = req.body;
    if (!nombre || !rut) return res.status(400).json({ error: "Debe ingresar el nombre de la mascota y el RUT del dueño" });

    try {
        const mascotas = await leerDatos();
        mascotas.push({ nombre, rut });
        await guardarDatos(mascotas);
        res.status(201).json({ mensaje: "Mascota inscrita exitosamente en el Registro Civil" });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar la inscripción" });
    }
});

// 5. DELETE con parámetro nombre: elimina la mascota con ese nombre (si es que existe).
app.delete('/api/mascotas/nombre/:nombre', async (req, res) => {
    try {
        const mascotas = await leerDatos();
        const longitudInicial = mascotas.length;
        const filtradas = mascotas.filter(m => m.nombre.toLowerCase() !== req.params.nombre.toLowerCase());
        
        if (longitudInicial === filtradas.length) return res.status(404).json({ error: "La mascota no existe en los registros" });
        
        await guardarDatos(filtradas);
        res.json({ mensaje: "Mascota eliminada del registro" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 6. DELETE con parámetro rut: elimina todas las mascotas asociadas a ese rut.
app.delete('/api/mascotas/rut/:rut', async (req, res) => {
    try {
        const mascotas = await leerDatos();
        const longitudInicial = mascotas.length;
        const filtradas = mascotas.filter(m => m.rut !== req.params.rut);
        
        if (longitudInicial === filtradas.length) return res.status(404).json({ error: "No se encontraron mascotas inscritas bajo este RUT" });
        
        await guardarDatos(filtradas);
        res.json({ mensaje: "Todas las mascotas asociadas al RUT han sido eliminadas" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.listen(PORT, () => {
    console.log(`Ministerio de Mascotas corriendo en http://localhost:${PORT}`);
});
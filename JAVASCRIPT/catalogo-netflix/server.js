const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Usamos 'promises' para que la lectura sea Non-blocking
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares (Configuraciones base)
app.use(cors()); // Permite que nuestro HTML se comunique con el servidor
app.use(express.json()); // Transforma la información que llega por POST a formato JSON
app.use(express.static('public')); // Conecta nuestra carpeta public

// Ubicación de nuestros archivos de texto
const archivos = {
    peliculas: path.join(__dirname, 'peliculas.txt'),
    series: path.join(__dirname, 'series.txt')
};

// ==========================================
// 1. MÉTODO GET: Leer el catálogo
// ==========================================
app.get('/api/catalogo', async (req, res) => {
    const { tipo } = req.query; // Leemos si nos piden ?tipo=peliculas o ?tipo=series

    if (tipo !== 'peliculas' && tipo !== 'series') {
        return res.status(400).json({ error: "Debe especificar tipo=peliculas o tipo=series" });
    }

    try {
        // Lectura Non-blocking (asíncrona) del archivo
        const data = await fs.readFile(archivos[tipo], 'utf-8');
        
        // Separamos el texto por líneas y quitamos las líneas vacías
        const lineas = data.split('\n').filter(linea => linea.trim() !== '');
        
        // Transformamos el texto plano a un formato JSON estructurado
        const jsonResult = lineas.map(linea => {
            const partes = linea.split(',').map(item => item.trim());
            if (tipo === 'peliculas') {
                return { nombre: partes[0], director: partes[1], anio: partes[2] };
            } else {
                return { nombre: partes[0], anio: partes[1], temporadas: partes[2] };
            }
        });

        res.json(jsonResult); // El servicio responde en formato JSON
    } catch (error) {
        res.status(500).json({ error: "Error leyendo el archivo" });
    }
});

// ==========================================
// 2. MÉTODO POST: Insertar nueva película o serie
// ==========================================
app.post('/api/catalogo', async (req, res) => {
    // La información viene en el body del request en formato JSON
    const { tipo, nombre, dato2, dato3 } = req.body;

    if (!tipo || !nombre || !dato2 || !dato3) {
        return res.status(400).json({ error: "Faltan datos para crear el registro" });
    }

    // Armamos la línea de texto según el formato del archivo
    const nuevaLinea = `\n${nombre}, ${dato2}, ${dato3}`;

    try {
        // Escritura Non-blocking al final del archivo
        await fs.appendFile(archivos[tipo], nuevaLinea, 'utf-8');
        res.status(201).json({ mensaje: "Registro agregado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error guardando el archivo" });
    }
});

// ==========================================
// 3. MÉTODO DELETE: Eliminar del archivo
// ==========================================
// El nombre y el tipo vienen como parámetros en la URL
app.delete('/api/catalogo/:tipo/:nombre', async (req, res) => {
    const { tipo, nombre } = req.params;

    if (tipo !== 'peliculas' && tipo !== 'series') {
        return res.status(400).json({ error: "Tipo inválido" });
    }

    try {
        // Leemos todo el archivo
        const data = await fs.readFile(archivos[tipo], 'utf-8');
        const lineas = data.split('\n').filter(linea => linea.trim() !== '');
        
        // Filtramos: nos quedamos con todos EXCEPTO el que tenga el nombre a eliminar
        const lineasRestantes = lineas.filter(linea => {
            const nombreItem = linea.split(',')[0].trim();
            return nombreItem.toLowerCase() !== nombre.toLowerCase();
        });

        // Sobreescribimos el archivo con la nueva lista
        await fs.writeFile(archivos[tipo], lineasRestantes.join('\n'), 'utf-8');
        res.json({ mensaje: "Registro eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ error: "Error modificando el archivo" });
    }
});

// ==========================================
// 4. MANEJO DE MÉTODOS NO PERMITIDOS
// ==========================================
// Cualquier otro método será rechazado con código 405
app.use('/api/catalogo', (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'DELETE') {
        return res.status(405).json({ error: "Método no permitido. Solo se acepta GET, POST y DELETE." });
    }
    next();
});

// Encender el servidor
app.listen(PORT, () => {
    console.log(`Servidor Netflix corriendo en http://localhost:${PORT}`);
});
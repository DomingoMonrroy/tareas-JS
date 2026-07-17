const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); 
app.use(express.static('public')); 

const dataPath = path.join(__dirname, 'banco.json');

// --- RUTAS GET (LEER) ---
app.get('/api/clientes', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: "Error al leer la base de datos" });
    }
});

app.get('/api/clientes/rut', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const clientesConRut = JSON.parse(data).filter(c => c.cuenta_rut !== null);
        res.json(clientesConRut);
    } catch (error) {
        res.status(500).json({ error: "Error al leer la base de datos" });
    }
});

// --- RUTAS POST Y PUT (CREAR Y ACTUALIZAR) ---
app.post('/api/clientes', async (req, res) => {
    const { rut_cliente, nombre, tipo_cuenta, numero_cuenta } = req.body;
    if (!rut_cliente || !nombre || !tipo_cuenta || !numero_cuenta) return res.status(400).json({ error: "Faltan datos" });

    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const clientes = JSON.parse(data);
        clientes.push({
            rut_cliente, nombre,
            cuenta_rut: tipo_cuenta === 'RUT' ? numero_cuenta : null,
            cuentas_ahorro: tipo_cuenta === 'AHORRO' ? [numero_cuenta] : []
        });
        await fs.writeFile(dataPath, JSON.stringify(clientes, null, 2));
        res.status(201).json({ mensaje: "Cliente creado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar" });
    }
});

app.put('/api/clientes/:rut/cuenta', async (req, res) => {
    const { tipo_cuenta, numero_cuenta } = req.body;
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const clientes = JSON.parse(data);
        const index = clientes.findIndex(c => c.rut_cliente === req.params.rut);
        
        if (index === -1) return res.status(404).json({ error: "Cliente no encontrado" });

        if (tipo_cuenta === 'RUT') {
            if (clientes[index].cuenta_rut !== null) return res.status(400).json({ error: "Ya posee cuenta RUT" });
            clientes[index].cuenta_rut = numero_cuenta;
        } else if (tipo_cuenta === 'AHORRO') {
            clientes[index].cuentas_ahorro.push(numero_cuenta);
        }

        await fs.writeFile(dataPath, JSON.stringify(clientes, null, 2));
        res.json({ mensaje: "Cuenta agregada" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar" });
    }
});

// --- RUTAS DELETE (ELIMINAR) ---

// Eliminar cliente completo
app.delete('/api/clientes/:rut', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        let clientes = JSON.parse(data);
        const filtrados = clientes.filter(c => c.rut_cliente !== req.params.rut);
        
        if (clientes.length === filtrados.length) return res.status(404).json({ error: "Cliente no encontrado" });
        
        await fs.writeFile(dataPath, JSON.stringify(filtrados, null, 2));
        res.json({ mensaje: "Cliente eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

// Eliminar solo la cuenta RUT
app.delete('/api/clientes/:rut/rut', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const clientes = JSON.parse(data);
        const index = clientes.findIndex(c => c.rut_cliente === req.params.rut);
        
        if (index === -1) return res.status(404).json({ error: "Cliente no encontrado" });
        
        clientes[index].cuenta_rut = null;
        await fs.writeFile(dataPath, JSON.stringify(clientes, null, 2));
        res.json({ mensaje: "Cuenta RUT eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

// Eliminar una cuenta de AHORRO específica
app.delete('/api/clientes/:rut/ahorro/:cuenta', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const clientes = JSON.parse(data);
        const index = clientes.findIndex(c => c.rut_cliente === req.params.rut);
        
        if (index === -1) return res.status(404).json({ error: "Cliente no encontrado" });
        
        clientes[index].cuentas_ahorro = clientes[index].cuentas_ahorro.filter(cta => cta !== req.params.cuenta);
        await fs.writeFile(dataPath, JSON.stringify(clientes, null, 2));
        res.json({ mensaje: "Cuenta de ahorro eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor BancoEstado corriendo en http://localhost:${PORT}`);
});
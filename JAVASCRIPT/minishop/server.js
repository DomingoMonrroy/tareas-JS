const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: 'main',
    // Aquí creamos el helper "mayusculas" que pide el desafío
    helpers: {
        mayusculas: function(texto) {
            return texto.toUpperCase();
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración para leer archivos estáticos (CSS, imágenes) y datos de formularios
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Datos de la tienda
const tienda = {
    nombre: "MiniShop",
    mensaje: "¡Bienvenido a la mejor tienda ficticia de la web!"
};

const productos = [
    { nombre: "Camiseta Básica", precio: 15, disponible: true, imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600" },
    { nombre: "Pantalón Jeans", precio: 30, disponible: false, imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600" },
    { nombre: "Zapatos Deportivos", precio: 50, disponible: true, imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },
    { nombre: "Chaqueta de Cuero", precio: 80, disponible: true, imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600" },
    { nombre: "Gorra Clásica", precio: 12, disponible: true, imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600" },
    { nombre: "Bolso de Mano", precio: 45, disponible: false, imagen: "https://images.unsplash.com/photo-1526170375885-43f5d6d4f00f?w=600" }
];

// --- RUTAS ---

// Ruta GET / (Inicio)
app.get('/', (req, res) => {
    res.render('home', { 
        tienda: tienda.nombre, 
        mensaje: tienda.mensaje, 
        productos: productos 
    });
});

// Ruta GET /about
app.get('/about', (req, res) => {
    res.render('about');
});

// Ruta GET /contact (Muestra el formulario)
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Ruta POST /contact (Procesa el formulario)
app.post('/contact', (req, res) => {
    // Capturamos el nombre que viene del formulario
    const nombreIngresado = req.body.nombre;
    // Renderizamos la vista success pasando el nombre dinámico
    res.render('success', { nombreUsuario: nombreIngresado });
});

// Ruta de manejo de métodos no permitidos (Error 405)
app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).send("Método no permitido");
    }
    next();
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor de MiniShop corriendo en http://localhost:${PORT}`);
});
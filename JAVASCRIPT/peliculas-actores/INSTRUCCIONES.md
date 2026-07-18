# Instrucciones de Ejecución - Sistema de Películas y Actores (Sequelize)

## 1. Configuración de la Base de Datos
1. Abre pgAdmin 4 (o tu gestor de PostgreSQL preferido).
2. Crea una base de datos nueva y vacía llamada exactamente: `peliculas_db`.
3. No es necesario ejecutar ningún script de creación de tablas. Sequelize se encargará de crear automáticamente las tablas `peliculas`, `actores` y la tabla intermedia `peliculas_actores` al iniciar el servidor.

## 2. Configuración de Credenciales
1. En la raíz del proyecto, asegúrate de tener el archivo `.env` configurado.
2. Modifica el archivo `.env` con tus credenciales locales de PostgreSQL. Debe quedar con esta estructura:
   - `DB_USER` = tu usuario (ej: postgres)
   - `DB_PASS` = tu contraseña de la base de datos
   - `DB_HOST` = localhost
   - `DB_NAME` = peliculas_db
   - `PORT` = 3000

## 3. Instalación y Ejecución
1. Abre una terminal en la carpeta raíz del proyecto.
2. Ejecuta el comando para instalar todas las dependencias necesarias:
   `npm install`
3. Ejecuta el comando para iniciar el servidor:
   `node server.js`
4. Abre tu navegador web e ingresa a la siguiente ruta para operar la aplicación: 
   `http://localhost:3000`
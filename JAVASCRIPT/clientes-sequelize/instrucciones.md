# Instrucciones de Ejecución - Sistema de Clientes (Sequelize)

## 1. Configuración de la Base de Datos
1. Abre pgAdmin 4 (o tu gestor de PostgreSQL preferido).
2. Crea una base de datos nueva y vacía llamada exactamente: `clientes_db`.
3. No es necesario ejecutar ningún script de tablas, Sequelize se encargará de crearlas automáticamente al iniciar el servidor.

## 2. Configuración de Credenciales
1. En la raíz del proyecto, asegúrate de tener el archivo `.env` (si no está, renombra o copia el contenido basándote en las variables requeridas).
2. Modifica el archivo `.env` con tus credenciales locales de PostgreSQL:
   - `DB_USER` = tu usuario (ej: postgres)
   - `DB_PASS` = tu contraseña
   - `DB_HOST` = localhost
   - `DB_NAME` = clientes_db
   - `PORT` = 3000

## 3. Instalación y Ejecución
1. Abre una terminal en la carpeta raíz del proyecto.
2. Ejecuta el comando para instalar las dependencias:
   `npm install`
3. Ejecuta el comando para iniciar el servidor:
   `node server.js`
4. Abre tu navegador web e ingresa a: `http://localhost:3000`
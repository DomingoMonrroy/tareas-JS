-- 1. Crear las tablas (Respeta el orden por las llaves foráneas)
CREATE TABLE clientes (
    rut VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE direcciones (
    id_direccion SERIAL PRIMARY KEY,
    rut VARCHAR(10) REFERENCES clientes(rut),
    direccion VARCHAR(200)
);

CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(200),
    precio INTEGER,
    existencias INTEGER
);

CREATE TABLE orden (
    id_orden SERIAL PRIMARY KEY,
    rut VARCHAR(10) REFERENCES clientes(rut),
    id_direccion INTEGER REFERENCES direcciones(id_direccion),
    precio_total INTEGER
);

CREATE TABLE lista_productos (
    id_lista SERIAL PRIMARY KEY,
    id_orden INTEGER REFERENCES orden(id_orden),
    id_producto INTEGER REFERENCES productos(id_producto),
    cantidad_producto INTEGER
);

CREATE TABLE despachos (
    id_despacho SERIAL PRIMARY KEY,
    id_orden INTEGER REFERENCES orden(id_orden),
    id_direccion INTEGER REFERENCES direcciones(id_direccion)
);

-- 2. Insertar datos mínimos de prueba
INSERT INTO clientes (rut, nombre) VALUES 
('11111111-1', 'Ana Silva'),
('22222222-2', 'Pedro Soto');

INSERT INTO direcciones (rut, direccion) VALUES 
('11111111-1', 'Avenida Siempreviva 742'),
('22222222-2', 'Calle Falsa 123');

INSERT INTO productos (nombre, precio, existencias) VALUES 
('Teclado Mecánico', 45000, 10),
('Mouse Inalámbrico', 25000, 5),
('Monitor 24 pulgadas', 120000, 2);
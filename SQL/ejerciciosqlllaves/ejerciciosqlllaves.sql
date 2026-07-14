-- --- PEGA EL CÓDIGO DEL PASO 1 DESDE AQUÍ ---

-- 1. LIMPIEZA PREVIA (Por si necesitas ejecutar el código más de una vez)
DROP TABLE IF EXISTS Cuentas;
DROP TABLE IF EXISTS Clientes;

-- 2. CREACIÓN DE TABLAS Y LLAVES
CREATE TABLE Clientes (
    id_cliente INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT CHECK (edad BETWEEN 18 AND 85) NOT NULL
);

CREATE TABLE Cuentas (
    id_cuenta INT PRIMARY KEY,
    id_cliente INT NOT NULL,
    saldo NUMERIC(10, 2) CHECK (saldo BETWEEN -5000.00 AND 100000.00) NOT NULL,
    CONSTRAINT fk_cliente
        FOREIGN KEY (id_cliente) 
        REFERENCES Clientes (id_cliente)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- 3. INSERCIÓN DE 5 CLIENTES
INSERT INTO Clientes (id_cliente, nombre, edad) VALUES (1, 'Ana García', 78);
INSERT INTO Clientes (id_cliente, nombre, edad) VALUES (2, 'Luis Pérez', 25);
INSERT INTO Clientes (id_cliente, nombre, edad) VALUES (3, 'Maria Soto', 40);
INSERT INTO Clientes (id_cliente, nombre, edad) VALUES (4, 'Carlos Ruiz', 80);
INSERT INTO Clientes (id_cliente, nombre, edad) VALUES (5, 'Elena Torres', 32);

-- 4. INSERCIÓN DE 15 CUENTAS
-- Cuentas de Ana
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (101, 1, 50000.00);
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (102, 1, -1200.50);
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (103, 1, 100.00);
-- Cuentas de Luis
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (201, 2, 850.75);
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (202, 2, -500.00);
-- Cuentas de Maria
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (301, 3, 15000.00);
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (302, 3, 200.00);
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (303, 3, -4999.99);
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (304, 3, 75000.00);
-- Cuentas de Carlos
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (401, 4, 1000.00);
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (402, 4, 2000.00);
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (403, 4, 3000.00);
-- Cuentas de Elena
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (501, 5, 50.00);
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (502, 5, 120.00);
INSERT INTO Cuentas (id_cuenta, id_cliente, saldo) VALUES (503, 5, 900.00);

-- 5. ACTUALIZACIÓN (UPDATE) Y BORRADO (DELETE)
UPDATE Cuentas SET saldo = saldo + 500.00 WHERE id_cuenta = 402;
DELETE FROM Cuentas WHERE id_cuenta = 503;

-- --- BORRA ESTA LÍNEA Y PEGA EL CÓDIGO DEL PASO 2 DESDE AQUÍ ---

-- Q3: Saldo de cada cuenta del cliente de mayor edad.
SELECT c.saldo
FROM Cuentas c
JOIN Clientes cl ON c.id_cliente = cl.id_cliente
WHERE cl.edad = (SELECT MAX(edad) FROM Clientes);

-- Q4: Promedio de edad de clientes con saldo negativo[cite: 5].
SELECT AVG(cl.edad) AS promedio_edad
FROM Clientes cl
WHERE cl.id_cliente IN (
    SELECT id_cliente FROM Cuentas WHERE saldo < 0
);

-- Q5: Nombre y cantidad de cuentas de quienes tienen más de una[cite: 5].
SELECT cl.nombre, COUNT(c.id_cuenta) AS cantidad_cuentas
FROM Clientes cl
JOIN Cuentas c ON cl.id_cliente = c.id_cliente
GROUP BY cl.id_cliente, cl.nombre
HAVING COUNT(c.id_cuenta) > 1;

-- Q6: Suma de saldos por cliente para quienes tienen más de una cuenta[cite: 5].
SELECT cl.nombre, SUM(c.saldo) AS saldo_combinado
FROM Clientes cl
JOIN Cuentas c ON cl.id_cliente = c.id_cliente
GROUP BY cl.id_cliente, cl.nombre
HAVING COUNT(c.id_cuenta) > 1;

-- Q7: Todos los clientes y su saldo combinado, considerando solo aquellos con al menos una cuenta con saldo negativo[cite: 5].
SELECT cl.nombre, SUM(c.saldo) AS saldo_combinado
FROM Clientes cl
JOIN Cuentas c ON cl.id_cliente = c.id_cliente
WHERE cl.id_cliente IN (
    SELECT id_cliente FROM Cuentas WHERE saldo < 0
)
GROUP BY cl.id_cliente, cl.nombre;
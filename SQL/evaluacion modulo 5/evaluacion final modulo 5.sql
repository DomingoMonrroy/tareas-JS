-- --- 1. PREPARANDO LA MESA DE TRABAJO (CÓDIGO DEL PROFESOR) ---
DROP TABLE IF EXISTS reparto_soltera_otra_vez;
CREATE TABLE reparto_soltera_otra_vez (
    nombre character varying(255) NOT NULL,
    temporadas integer,
    protagonico boolean,
    sueldo integer,
    PRIMARY KEY (nombre)
);

INSERT INTO reparto_soltera_otra_vez (nombre, temporadas, protagonico, sueldo) VALUES 
('Paz Bascuñán', 3, true, 100), ('Pablo Macaya', 3, true, 100), ('Cristián Arriagada', 3, true, 95),
('Josefina Montané', 2, true, 90), ('Loreto Aravena', 3, true, 95), ('Lorena Bosch', 2, true, 90),
('Nicolás Poblete', 2, true, 85), ('Héctor Morales', 3, true, 80), ('Aranzazú Yankovic', 2, true, 80),
('Luis Gnecco', 3, true, 95), ('Catalina Guerra', 3, true, 90), ('Solange Lackington', 2, true, 70),
('Ignacio Garmendia', 2, true, 70), ('Julio González', 3, true, 75), ('Antonella Orsini', 3, true, 70),
('Tamara Acosta', 1, false, 60), ('Silvia Santelices', 1, false, 55), ('Alejandro Trejo', 1, false, 55),
('Grimanesa Jiménez', 1, false, 60);

DROP TABLE IF EXISTS reparto_papi_ricky;
CREATE TABLE reparto_papi_ricky (
    nombre character varying(255) NOT NULL,
    capitulos integer,
    protagonico boolean,
    sueldo integer,
    PRIMARY KEY (nombre)
);

INSERT INTO reparto_papi_ricky (nombre, capitulos, protagonico, sueldo) VALUES 
('Jorge Zabaleta', 135, true, 100), ('Belén Soto', 135, true, 100), ('Tamara Acosta', 135, true, 100),
('María Elena Swett', 135, true, 100), ('Juan Falcón', 135, true, 95), ('Silvia Santelices', 135, true, 85),
('Leonardo Perucci', 135, true, 85), ('Teresita Reyes', 135, true, 80), ('Luis Gnecco', 135, true, 75),
('Alejandro Trejo', 135, true, 65), ('Grimanesa Jiménez', 135, true, 60), ('Remigio Remedy', 135, true, 60),
('María Paz Grandjean', 135, true, 55), ('Héctor Morales', 135, true, 50), ('César Caillet', 135, true, 40),
('José Tomás Guzmán', 135, true, 25), ('Manuel Aguirre', 135, true, 30);


-- --- 2. RESPUESTAS A LA EVALUACIÓN (PARTE 1) ---

-- PREGUNTA 1: Actores en ambas teleseries, sus sueldos y la suma.
SELECT 
    s.nombre, 
    s.sueldo AS "sueldo en soltera", 
    p.sueldo AS "sueldo en papi", 
    (s.sueldo + p.sueldo) AS "sueldo sumado"
FROM reparto_soltera_otra_vez s
JOIN reparto_papi_ricky p ON s.nombre = p.nombre
ORDER BY s.nombre;

-- PREGUNTA 2: Actores exclusivos de Soltera otra vez con sueldo > 90.
SELECT nombre, sueldo
FROM reparto_soltera_otra_vez
WHERE sueldo > 90 
AND nombre NOT IN (SELECT nombre FROM reparto_papi_ricky);

-- PREGUNTA 3: Actores con sueldo < 85 que actuaron en una u otra, pero NO en ambas.
SELECT nombre, sueldo AS sueldo_obtenido, 'Soltera Otra Vez' AS teleserie
FROM reparto_soltera_otra_vez
WHERE sueldo < 85 
AND nombre NOT IN (SELECT nombre FROM reparto_papi_ricky)
UNION
SELECT nombre, sueldo AS sueldo_obtenido, 'Papi Ricky' AS teleserie
FROM reparto_papi_ricky
WHERE sueldo < 85 
AND nombre NOT IN (SELECT nombre FROM reparto_soltera_otra_vez);

-- --- 3. PARTE 2: INGENIERÍA Y MODELO ENTIDAD-RELACIÓN ---

-- Limpieza por si necesitas re-ejecutar
DROP TABLE IF EXISTS reparto_actores;
DROP TABLE IF EXISTS teleseries;
DROP TABLE IF EXISTS actores;

-- A) CREAMOS LOS CATÁLOGOS PRINCIPALES (Entidades)
CREATE TABLE actores (
    id_actor SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE teleseries (
    id_teleserie SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE
);

-- B) CREAMOS LA TABLA INTERMEDIA (El Puente / Relación)
CREATE TABLE reparto_actores (
    id_actor INT REFERENCES actores(id_actor),
    id_teleserie INT REFERENCES teleseries(id_teleserie),
    protagonico BOOLEAN,
    sueldo INT,
    PRIMARY KEY (id_actor, id_teleserie)
);

-- C) POBLANDO EL NUEVO SISTEMA (Migración Automática)[cite: 5]

-- 1. Insertamos las teleseries
INSERT INTO teleseries (nombre) VALUES ('Soltera otra vez'), ('Papi Ricky');

-- 2. Insertamos a los actores (Aspirando datos sin repetir)
INSERT INTO actores (nombre)
SELECT DISTINCT nombre FROM (
    SELECT nombre FROM reparto_soltera_otra_vez
    UNION
    SELECT nombre FROM reparto_papi_ricky
) AS todos_los_actores;

-- 3. Llenamos el puente conectando los IDs para Soltera otra vez
INSERT INTO reparto_actores (id_actor, id_teleserie, protagonico, sueldo)
SELECT a.id_actor, t.id_teleserie, s.protagonico, s.sueldo
FROM reparto_soltera_otra_vez s
JOIN actores a ON s.nombre = a.nombre
JOIN teleseries t ON t.nombre = 'Soltera otra vez';

-- 4. Llenamos el puente conectando los IDs para Papi Ricky
INSERT INTO reparto_actores (id_actor, id_teleserie, protagonico, sueldo)
SELECT a.id_actor, t.id_teleserie, p.protagonico, p.sueldo
FROM reparto_papi_ricky p
JOIN actores a ON p.nombre = a.nombre
JOIN teleseries t ON t.nombre = 'Papi Ricky';

-- --- 4. CONSULTA FINAL DE LA EVALUACIÓN (PARTE 2) ---
-- Mostrar teleseries y actores de reparto, excluyendo roles secundarios[cite: 5]

SELECT t.nombre AS teleserie, a.nombre AS actor, r.sueldo
FROM teleseries t
JOIN reparto_actores r ON t.id_teleserie = r.id_teleserie
JOIN actores a ON r.id_actor = a.id_actor
WHERE r.protagonico = true
ORDER BY t.nombre, a.nombre;
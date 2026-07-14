-- --- PEGA EL CÓDIGO DEL PASO 1 DESDE AQUÍ ---

-- 1. PREPARACIÓN DE LA MESA DE TRABAJO
DROP TABLE IF EXISTS finanzas_personales;

CREATE TABLE finanzas_personales
(
    nombre character varying(20) COLLATE pg_catalog."default" NOT NULL,
    me_debe integer,
    cuotas_cobrar integer,
    le_debo integer,
    cuotas_pagar integer,
    CONSTRAINT finanzas_personales_pkey PRIMARY KEY (nombre)
);

-- 2. LLENANDO LA TABLA CON TUS DATOS
insert into finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar) values ('tía carmen', 0, 0, 5000, 1);
insert into finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar) values ('papá', 0, 0, 15000, 3);
insert into finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar) values ('nacho', 10000, 2, 7000, 1);
insert into finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar) values ('almacén esquina', 0, 0, 13000, 2);
insert into finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar) values ('vicios varios', 0, 0, 35000, 35);
insert into finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar) values ('compañero trabajo', 50000, 5, 0, 0);

-- RESPUESTA 1: ¿A quién le debe más dinero y cuánto?
SELECT nombre, le_debo 
FROM finanzas_personales 
ORDER BY le_debo DESC 
LIMIT 1;

-- RESPUESTA 2: ¿Quién le debe más dinero a ud. y cuánto?
SELECT nombre, me_debe 
FROM finanzas_personales 
ORDER BY me_debe DESC 
LIMIT 1;

-- RESPUESTA 3: ¿Cuánto dinero debe en total?
SELECT SUM(le_debo) AS "Deuda Total" 
FROM finanzas_personales;

-- --- BORRA ESTA LÍNEA Y PEGA EL CÓDIGO DEL PASO 2 DESDE AQUÍ ---

-- RESPUESTA 4: ¿Cuánto dinero debe en promedio?
SELECT AVG(le_debo) AS "Promedio Deuda" 
FROM finanzas_personales;

-- RESPUESTA 5: ¿Cuántos meses demoraría en saldar su deuda (pagando 1 cuota al mes)?
SELECT SUM(cuotas_pagar) AS meses 
FROM finanzas_personales;

-- RESPUESTA 6: Si cobra todo lo que le deben y lo usa para pagar su deuda...
-- ¿A cuánto ascendería su nueva deuda y de cuánto sería la nueva cuota mensual?
SELECT 
    (SUM(le_debo) - SUM(me_debe)) AS "Nueva Deuda",
    (SUM(le_debo) - SUM(me_debe)) / SUM(cuotas_pagar) AS "Valor cuota"
FROM finanzas_personales;

-- --- BORRA ESTA LÍNEA Y PEGA EL CÓDIGO DEL PASO 3 DESDE AQUÍ ---

-- 7. Insertar el nuevo registro de tu pareja
INSERT INTO finanzas_personales (nombre, me_debe, cuotas_cobrar, le_debo, cuotas_pagar) 
VALUES ('pareja', 0, 0, 50000, 1);

-- 8. ¿De cuánto será la cuota a pagar este mes? (sumando la cuota mensual de cada deuda)
SELECT SUM(le_debo / cuotas_pagar) AS "cuota mes" 
FROM finanzas_personales 
WHERE cuotas_pagar > 0;

-- 9. Negociación con el almacén: Update para cambiar sus cuotas a 13
UPDATE finanzas_personales 
SET cuotas_pagar = 13 
WHERE nombre = 'almacén esquina';

-- 10. ¿De cuánto será la nueva cuota a pagar este mes con el ajuste?
SELECT SUM(le_debo / cuotas_pagar) AS "cuota mes" 
FROM finanzas_personales 
WHERE cuotas_pagar > 0;

-- --- HASTA AQUÍ EL PASO 3 ---

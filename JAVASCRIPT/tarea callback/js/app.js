// 1. Definimos la función principal que recibe un 'callback' como parámetro
function validar_numero(callback) {
    
    // Pedimos el dato al usuario
    let dato = prompt("Ingresa un número:");
    
    // Verificamos si NO es un número usando isNaN (Is Not a Number)
    if (isNaN(dato) || dato === "") {
        // Si ingresó letras o nada, llamamos al callback pasándole un texto de error
        callback("Ud. ingresó caracteres incorrectos");
    } else {
        // Si es un número válido, llamamos al callback pasándole un texto de éxito
        callback("Correcto. El número ingresado es válido.");
    }
}

// 2. Aquí EJECUTAMOS la función y le pasamos el callback en forma de función flecha (=>)
validar_numero((mensaje) => {
    console.log(mensaje);
    alert(mensaje);
});
function calcular_y_avisar_despues(numero, callback) {
    let sumatoriaImpares = 0;

    // Recorremos desde el 1 hasta el número ingresado
    for (let i = 1; i <= numero; i++) {
        // Si el número dividido en 2 NO da un resto de 0, significa que es impar
        if (i % 2 !== 0) {
            sumatoriaImpares = sumatoriaImpares + i;
        }
    }

    // Usamos setTimeout para crear el retraso de 5 segundos (5000 milisegundos)
    setTimeout(() => {
        let textoFinal = "El valor de la sumatoria es " + sumatoriaImpares + ". Este resultado se obtuvo hace 5 segundos";
        callback(textoFinal);
    }, 5000);
}

// Ejecutamos la función de prueba (ejemplo con el número 10)
calcular_y_avisar_despues(10, (mensaje) => {
    console.log(mensaje);
    alert(mensaje);
});
function calcular_y_avisar_dependiendo(numero, callback, callback_error) {
    let sumatoriaActual = 0;
    let sumatoriaTotal = 0;

    // Calculamos las sumatorias sucesivas
    for (let i = 1; i <= numero; i++) {
        sumatoriaActual = sumatoriaActual + i; // Ejemplo: 1+2
        sumatoriaTotal = sumatoriaTotal + sumatoriaActual; // Suma el bloque al gran total
    }

    // Evaluamos a qué callback llamar dependiendo del resultado
    if (sumatoriaTotal < 1000) {
        // Éxito: menor a 1000
        callback("Las sumatorias sucesivas de " + numero + " es " + sumatoriaTotal);
    } else {
        // Error: 1000 o superior. Mostramos el error, pero indicamos el resultado igual.
        callback_error("Error: El número sobrepasa el objetivo. De todas formas, el resultado obtenido fue " + sumatoriaTotal);
    }
}

// Ejecutamos la función de prueba con un número bajo (ej: 5) para probar el éxito
calcular_y_avisar_dependiendo(5, 
    // Primer callback (Éxito)
    (mensajeExito) => {
        console.log("ÉXITO: " + mensajeExito);
        alert(mensajeExito);
    },
    // Segundo callback (Error)
    (mensajeError) => {
        console.error("ERROR: " + mensajeError);
        alert(mensajeError);
    }
);

// Ejecutamos la función de prueba con un número muy alto (ej: 50) para forzar el error
calcular_y_avisar_dependiendo(50, 
    (mensajeExito) => {
        console.log("ÉXITO: " + mensajeExito);
    },
    (mensajeError) => {
        console.error("ERROR: " + mensajeError);
        alert(mensajeError);
    }
);
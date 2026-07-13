// 1. Creamos una caja grande (un Array o Lista) vacía para guardar los números
let listaNumeros = [];

// 2. Pedimos el primer número, lo convertimos y lo guardamos
let numero1 = parseFloat(prompt("Ingresa el primer número:"));
listaNumeros.push(numero1);

// 3. Pedimos el segundo número, lo convertimos y lo guardamos
let numero2 = parseFloat(prompt("Ingresa el segundo número:"));
listaNumeros.push(numero2);

// 4. Pedimos el tercer número, lo convertimos y lo guardamos
let numero3 = parseFloat(prompt("Ingresa el tercer número:"));
listaNumeros.push(numero3);
// 5. Preparamos una variable para saber si alguien cambió de puesto
let huboCambios;

// 6. El ciclo do-while (Hacer... mientras)
do {
    huboCambios = false; // Al inicio de cada revisión, asumimos que nadie se moverá

    // 7. El ciclo for (recorre la fila)
    for (let i = 0; i < listaNumeros.length - 1; i++) {
        
        // 8. Comparamos si el actual es mayor que el que está a su derecha
        if (listaNumeros[i] > listaNumeros[i + 1]) {
            
            // 9. ¡Truco de los vasos! Intercambiamos los valores
            let vasoVacio = listaNumeros[i];
            listaNumeros[i] = listaNumeros[i + 1];
            listaNumeros[i + 1] = vasoVacio;
            
            huboCambios = true; // Avisamos que SÍ movimos a alguien
        }
    }
} while (huboCambios == true); // Repite todo MIENTRAS haya ocurrido algún cambio
// 10. Como la lista ya está ordenada, el menor SIEMPRE estará en la primera silla
let menor = listaNumeros[0];

// 11. Y el mayor SIEMPRE estará en la última silla
let mayor = listaNumeros[listaNumeros.length - 1];

// 12. Revisamos si el primero y el último son iguales (lo que significa que todos son idénticos)
if (menor === mayor) {
    document.write("<h2>Los tres números ingresados son idénticos: " + menor + "</h2>");
} else {
    document.write("<h2>El número menor es: " + menor + "</h2>");
    document.write("<h2>El número mayor es: " + mayor + "</h2>");
}
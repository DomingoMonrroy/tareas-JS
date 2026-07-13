const secreto = Math.floor(Math.random() * 10) + 1;
let usados = [];
function yaUsado(numero, lista) {
  return lista.includes(numero);
}
// 1. Le damos 3 vidas (intentos) al jugador
let intentosRestantes = 3;

// 2. La rueda del hámster: "MIENTRAS los intentos sean mayores a 0..."
while (intentosRestantes > 0) {
    
    // 3. Sacamos la ventanita, le pedimos el número y lo traducimos a Entero
    let numeroIngresado = parseInt(prompt("Adivina el número secreto (1 al 10):"));

 // ... (código anterior del while y el prompt) ...

    // Regla 1: ¿Es un texto inválido o está fuera del rango 1 al 10?
    if (isNaN(numeroIngresado) || numeroIngresado < 1 || numeroIngresado > 10) {
        alert("Fuera de rango. Ingresa un número válido del 1 al 10.");
        // No gastamos intento [cite: 114]
    }
    // Regla 2: Llamamos a la recepcionista. ¿El número ya está en la libreta?
    else if (yaUsado(numeroIngresado, usados) === true) {
        alert("Número repetido. Ya intentaste con el " + numeroIngresado);
        // Tampoco gastamos intento [cite: 118]
    }
    // Si pasó a los guardias, es un número válido y nuevo
    else {
        // 1. Lo anotamos en la libreta clínica
        usados.push(numeroIngresado);

        // 2. Pasamos el escáner láser: ¿Ganó el juego?
        if (numeroIngresado === secreto) {
            alert("¡Adivinaste! El número secreto era " + secreto);
            break; // ¡ATENCIÓN A ESTA PALABRA!
        } 
        // 3. Si no ganó, entonces se equivocó
        else {
            intentosRestantes--; // Le restamos la vida
            
            // Le avisamos cuántas vidas le quedan (solo si aún le quedan)
            if (intentosRestantes > 0) {
                alert("Incorrecto. Te quedan " + intentosRestantes + " intentos.");
            }
        }
    }

// 1. Revisamos si salió de la rueda por haberse quedado sin vidas
if (intentosRestantes === 0) {
    alert("Sin aciertos. El número secreto era: " + secreto);
}

// 2. Imprimimos el historial en la hoja clínica del HTML
document.getElementById('historial').innerHTML = "Intentos: " + usados.join(', ');
}
// 1. EL CAJÓN DEL ESCRITORIO (Caché)
// Creamos una lista vacía global. Aquí guardaremos los expedientes una vez que lleguen.
let archivoPacientes = [];

// 2. LA FUNCIÓN PRINCIPAL (Llamar al laboratorio)
function obtenerPersonajes() {
    
    // REGLA DE OPTIMIZACIÓN: Revisamos si el cajón ya tiene datos.
    if (archivoPacientes.length > 0) {
        // Si ya hay datos, NO llamamos a la API. Usamos lo que ya tenemos.
        console.log("Los datos ya estaban en el escritorio. Usando caché.");
        imprimirLista(archivoPacientes);
        return; // La palabra 'return' actúa como un freno de mano. Corta la función aquí mismo.
    }

    // Si el cajón está vacío, procedemos a hacer la llamada telefónica a la API
    console.log("Llamando a la API por primera vez...");
    
    // fetch() es el teléfono. Le pasamos la URL (el número del laboratorio)
    fetch("https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10")
        
        // .then() significa "LUEGO DE QUE CONTESTEN..."
        // Recibimos la respuesta cruda y usamos .json() para traducirla a un formato que podamos leer.
        .then(respuesta => respuesta.json())
        
        // .then() "LUEGO DE QUE ESTÉ TRADUCIDO..."
        // Tomamos esos datos limpios y hacemos nuestro trabajo.
        .then(datos => {
            // Guardamos los expedientes físicos en nuestro cajón del escritorio
            archivoPacientes = datos;
            
            // Imprimimos en la pantalla
            imprimirLista(archivoPacientes);
        });
}
// 3. FUNCIÓN PARA PINTAR LA LISTA EN EL HTML
function imprimirLista(lista) {
    // Buscamos la pizarra en blanco
    let pantalla = document.getElementById('pantalla');
    
    // Creamos un título
    let contenidoHtml = "<h3>1. Lista de personajes (primeros 10):</h3><ul>";

    // Recorremos la lista de expedientes. 
    // .forEach() es como decir "Por cada paciente en la lista, haz lo siguiente:"
    lista.forEach(personaje => {
        // Agregamos una viñeta (<li>) con los datos exigidos
        contenidoHtml += `<li>ID: ${personaje.id} - Nombre: ${personaje.name} - Especie: ${personaje.species}</li>`;
    });

    contenidoHtml += "</ul>"; // Cerramos la lista
    
    // Inyectamos todo este texto directamente en el HTML
    pantalla.innerHTML = contenidoHtml;
}
// 4. FUNCIÓN PARA AGRUPAR POR ESPECIE
function agruparPorEspecie() {
    // Si el usuario presiona este botón antes del primero, le pedimos que cargue los datos.
    if (archivoPacientes.length === 0) {
        alert("Primero debes obtener la lista de personajes (Botón 1)");
        return;
    }

    // Creamos un mueble clasificador vacío
    let clasificador = {};

    // Recorremos nuestros archivos
    archivoPacientes.forEach(personaje => {
        let especie = personaje.species; // Vemos qué especie tiene (ej: "Alien")

        // Si el mueble clasificador AÚN NO tiene un cajón para "Alien", se lo creamos
        if (!clasificador[especie]) {
            clasificador[especie] = []; 
        }

        // Metemos el nombre y ID del paciente en su cajón correspondiente
        clasificador[especie].push(`${personaje.name} (ID: ${personaje.id})`);
    });

    // Ahora preparamos el texto para la pantalla
    let pantalla = document.getElementById('pantalla');
    let contenidoHtml = "<h3>2. Agrupación por especie:</h3>";

    // Object.keys() saca todas las etiquetas de los cajones (Human, Alien)
    Object.keys(clasificador).forEach(etiqueta => {
        contenidoHtml += `<h4>${etiqueta}</h4><ul>`;
        
        // Sacamos a los pacientes de ese cajón específico
        clasificador[etiqueta].forEach(datosPaciente => {
            contenidoHtml += `<li> - ${datosPaciente}</li>`;
        });
        
        contenidoHtml += `</ul>`;
    });

    pantalla.innerHTML = contenidoHtml;
}
// 5. FUNCIÓN PARA VER LA FICHA INDIVIDUAL
function mostrarFicha(idBuscado) {
    if (archivoPacientes.length === 0) {
        alert("Primero debes obtener la lista de personajes (Botón 1)");
        return;
    }

    // Usamos .find() para buscar en nuestro cajón al paciente exacto que tenga ese ID
    let pacienteEncontrado = archivoPacientes.find(personaje => personaje.id === idBuscado);

    let pantalla = document.getElementById('pantalla');
    
    // Armamos la estructura visual de la "tarjeta"
    let contenidoHtml = `
        <h3>3. Ficha de personaje:</h3>
        <div class="tarjeta">
            <img src="${pacienteEncontrado.image}" alt="Foto de ${pacienteEncontrado.name}">
            <p><strong>ID:</strong> ${pacienteEncontrado.id}</p>
            <p><strong>Nombre:</strong> ${pacienteEncontrado.name}</p>
            <p><strong>Especie:</strong> ${pacienteEncontrado.species}</p>
        </div>
    `;

    pantalla.innerHTML = contenidoHtml;
}
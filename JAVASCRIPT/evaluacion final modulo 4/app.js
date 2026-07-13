// ==========================================
// 1. DEFINICIÓN DEL CARGO: SECRETARÍA TÉCNICA
// ==========================================
class SecretariaTecnica {
    
    // El constructor es lo primero que ocurre al encender el programa
    constructor() {
        this.fichajes = []; // El archivador vacío
        this.mandarOjeador(); // Arrancamos el proceso de buscar datos
    }

    // Método para traer los datos usando el método clásico (XMLHttpRequest)
    mandarOjeador() {
        const ojeador = new XMLHttpRequest();
        
        // Configuramos el viaje del ojeador a la base de datos extranjera
        ojeador.open("GET", "https://jsonplaceholder.typicode.com/users", true);
        
        // Instrucciones para cuando el ojeador vuelva con la información
        ojeador.onload = () => {
            if (ojeador.status === 200) { // Si la web responde "Todo OK"
                // Traducimos los datos a un formato que el club entienda y los guardamos
                this.fichajes = JSON.parse(ojeador.responseText);
                console.log("⚽ ¡Planillas de jugadores recibidas! Total en carpeta:", this.fichajes.length);
            } else {
                console.error("❌ Error de comunicación con la liga extranjera.");
            }
        };
        
        // Enviamos al ojeador
        ojeador.send();
    }

    // ==========================================
    // 2. EL LIBRITO TÁCTICO: JUGADAS PREPARADAS
    // ==========================================

    // Herramienta interna: El Buscador (para no repetir código en cada botón)
    buscarJugador() {
        const nombreBuscado = prompt("Ingresa el nombre y apellido del jugador (ej: Leanne Graham):");
        
        // .find() sale a buscar al primer jugador que coincida con el nombre
        const jugadorEncontrado = this.fichajes.find(jugador => jugador.name.toLowerCase() === nombreBuscado.toLowerCase());
        
        if (!jugadorEncontrado) {
            alert("VAR: Jugador no encontrado. Revisa la ortografía en la Lista Completa.");
        }
        return jugadorEncontrado; 
    }

    // JUGADA 1: Mostrar todos los nombres
    listarNombres() {
        console.log("--- 📋 PLANTILLA DEL EQUIPO ---");
        this.fichajes.forEach(jugador => {
            console.log(`Dorsal ${jugador.id}: ${jugador.name}`);
        });
    }

    // JUGADA 2: Información Básica
    infoBasica() {
        const jugador = this.buscarJugador(); 
        if (jugador) { 
            console.log(`--- 📄 FICHA BÁSICA DE ${jugador.name} ---`);
            console.log(`Apodo en la camiseta: ${jugador.username}`);
            console.log(`Contacto: ${jugador.email}`);
        }
    }

    // JUGADA 3: Dirección Completa
    direccionCompleta() {
        const jugador = this.buscarJugador();
        if (jugador) {
            console.log(`--- 🏠 DIRECCIÓN DE ${jugador.name} ---`);
            console.log(`Calle: ${jugador.address.street}`);
            console.log(`Dpto/Suite: ${jugador.address.suite}`);
            console.log(`Ciudad: ${jugador.address.city}`);
            console.log(`Código Postal: ${jugador.address.zipcode}`);
        }
    }

    // JUGADA 4: Información Avanzada y Agencia
    infoAvanzada() {
        const jugador = this.buscarJugador();
        if (jugador) {
            console.log(`--- 📊 INFO AVANZADA DE ${jugador.name} ---`);
            console.log(`Teléfono: ${jugador.phone}`);
            console.log(`Sitio Web: ${jugador.website}`);
            console.log(`--- 🏢 Agencia Representante ---`);
            console.log(`Nombre: ${jugador.company.name}`);
            console.log(`Lema Comercial: "${jugador.company.catchPhrase}"`);
        }
    }

    // JUGADA 5: Listar todas las Agencias
    listarCompanias() {
        console.log("--- 🤝 AGENCIAS DE REPRESENTANTES ---");
        this.fichajes.forEach(jugador => {
            console.log(`Agencia: ${jugador.company.name} | Lema: "${jugador.company.catchPhrase}"`);
        });
    }

    // JUGADA 6: Nombres Ordenados (A-Z)
    listarNombresOrdenados() {
        console.log("--- 📋 PLANTILLA ORDENADA (A-Z) ---");
        // Extraemos los nombres y los ordenamos con .sort()
        const nombres = this.fichajes.map(jugador => jugador.name);
        const nombresOrdenados = nombres.sort();
        
        nombresOrdenados.forEach(nombre => {
            console.log(nombre);
        });
    }
}

// ==========================================
// 3. LA CONTRATACIÓN (INICIALIZACIÓN)
// ==========================================
// Instanciamos la clase. Esto dispara el constructor y pone el código a correr.
const directorDeportivo = new SecretariaTecnica();
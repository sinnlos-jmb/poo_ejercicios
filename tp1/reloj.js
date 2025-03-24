class Reloj {
    // Constructor con valores por defecto
    constructor(horas = 0, minutos = 0, segundos = 0) {
        this.horas = Math.min(Math.max(0, horas), 23);
        this.minutos = Math.min(Math.max(0, minutos), 59);
        this.segundos = Math.min(Math.max(0, segundos), 59);
    }

    // Método para avanzar un segundo
    avanzar() {
        // Incrementar segundos
        this.segundos++;
        if (this.segundos > 59) {
            this.segundos = 0;
            this.minutos++;

            if (this.minutos > 59) {
                this.minutos = 0;
                this.horas++;

                if (this.horas > 23) {
                    this.horas = 0;
                    }
                }
            }
        }

    // Método para formatear y mostrar el tiempo
    mostrarTiempo() {
        // Usar padStart para asegurar dos dígitos
        const horasFormateadas = String(this.horas).padStart(2, '0');
        const minutosFormateados = String(this.minutos).padStart(2, '0');
        const segundosFormateados = String(this.segundos).padStart(2, '0');

        return `${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
    }

    // Método para establecer tiempo manualmente
    establecerTiempo(horas, minutos, segundos) {
        // Validar y establecer los valores
        this.horas = Math.min(Math.max(0, horas), 23);
        this.minutos = Math.min(Math.max(0, minutos), 59);
        this.segundos = Math.min(Math.max(0, segundos), 59);
    }
}

// Función de demostración
function demoReloj() {
    console.log("Demostración del Reloj Digital:");

    // Crear un reloj con un tiempo inicial
    const miReloj = new Reloj(23, 59, 58);
    
    console.log("Tiempo inicial:", miReloj.mostrarTiempo());

    // Avanzar varios segundos para mostrar el cambio
    for (let i = 0; i < 5; i++) {
        miReloj.avanzar();
        console.log(`Después de avanzar ${i+1} segundo(s):`, miReloj.mostrarTiempo());
    }

    // Establecer un tiempo específico
    miReloj.establecerTiempo(10, 30, 45);
    console.log("Tiempo establecido manualmente:", miReloj.mostrarTiempo());
}

// Ejemplo de uso interactivo
function ejemploUsoInteractivo() {
    const reloj = new Reloj(14, 59, 59);
    
    console.log("Reloj inicial:", reloj.mostrarTiempo());
    
    // Simular paso del tiempo
    const intervalId = setInterval(() => {
        reloj.avanzar();
        console.log("Tiempo actual:", reloj.mostrarTiempo());
        
        // Detener después de 10 avances
        if (reloj.horas === 15 && reloj.minutos === 0 && reloj.segundos === 5) {
            clearInterval(intervalId);
        }
    }, 1000);
}


// Ejecutar la demostración
//demoReloj();


// Descomentar para probar uso interactivo
ejemploUsoInteractivo();
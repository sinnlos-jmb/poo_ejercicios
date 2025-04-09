class Reloj {
    constructor(horas, minutos, segundos) {
        this.horas = horas;
        this.minutos = minutos;
        this.segundos = segundos;
    }
    
    // Dentro de la clase creo los métodos o funciones
    avanzar() {
        this.segundos += 1; // this.segundos++;

        if (this.segundos === 60) {
            this.segundos = 0;
            this.minutos += 1;
        }

        if (this.minutos === 60) {
            this.minutos = 0;
            this.horas += 1;
        }
if (this.horas === 24) {
            this.horas = 0;
        }
    }

	//metodo que muestra el horario
    mostrarTiempo() {
        const hh = this.horas < 10 ? `0${this.horas}` : this.horas;
        const mm = this.minutos < 10 ? `0${ this.minutos}` : this.minutos;
        const ss = this.segundos < 10 ? `0${this.segundos}` : this.segundos;
	return `${hh}:${mm}:${ss}`;
    }

    // Función para que el reloj tenga un comportamiento normal
    iniciar() {
        setInterval(() => {
            this.avanzar();
            console.log(this.mostrarTiempo());
        }, 1000);
    }
}

const newReloj = new Reloj(14,59,58);
newReloj.iniciar();
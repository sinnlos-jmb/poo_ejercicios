class Pelicula {
    // ✅ Declaramos el campo privado antes de usarlo
    #calificacion = null;

    constructor(titulo, director, calificacion) {
        this.titulo = titulo;
        this.director = director;
        this.setCalificacion(calificacion);
    }

    #validarCalificacion(valor) {
        return valor >= 1 && valor <= 10;
    }

    setCalificacion(valor) {
        if (this.#validarCalificacion(valor)) {
            this.#calificacion = valor;
        } else {
            throw new Error("La calificación debe estar entre 1 y 10");
        }
    }

    getCalificacion() {
        return this.#calificacion;
    }

    getInfo() {
        return `Película: ${this.titulo}
Director: ${this.director}
Calificación: ${this.#calificacion}/10`;
    }
}

// ✅ Prueba la clase
const pelicula1 = new Pelicula("Inception", "Christopher Nolan", 9);
console.log(pelicula1.getInfo());

// nconst pelicula2 = new Pelicula("Titanic", "James Cameron", 11); // ❌ Lanza error

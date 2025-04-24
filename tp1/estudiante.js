class Estudiante {
    #calificaciones
  constructor(p_nombre) {
    this.nombre = p_nombre;
    this.#calificaciones = [];
  }

  agregarCalificacion(nota) {
    if (nota >= 0 && nota <= 10) { 
      this.#calificaciones.push(nota);
      console.log(`Calificación ${nota} agregada para ${this.nombre}`);
    } else {
      console.log(`La nota ${nota} no es válida. Debe estar entre 0 y 10.`);
    }
  }

  // Método para calcular el promedio
  obtenerPromedio() {
    if (this.#calificaciones.length === 0) {
      return 0;
    }
    const suma = this.#calificaciones.reduce((total, nota) => total + nota, 0);
    return suma / this.#calificaciones.length;
  }

  // Método para mostrar la información del estudiante
  mostrarInfo() {
    const promedio = this.obtenerPromedio();
    console.log(`Estudiante: ${this.nombre}`);
    console.log(`Calificaciones: ${this.#calificaciones.join(', ')}`);
    console.log(`Promedio: ${promedio.toFixed(2)}`);
  }

  // Getters
  get_nombre() {
    return this.nombre;
  }

  get_calificaciones() {
    return [...this.#calificaciones]; // spread operator, devuelve una copia del array
  }
}

// Ejemplo de uso
const estudiante1 = new Estudiante("María García");
//estudiante1._nombre="fernando";

estudiante1.agregarCalificacion(8);
estudiante1.agregarCalificacion(9);
estudiante1.agregarCalificacion(7);
estudiante1.agregarCalificacion(10);
estudiante1.agregarCalificacion(-5); // Nota no válida

estudiante1.mostrarInfo();
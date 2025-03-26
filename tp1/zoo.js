// Clase Base: Animal
class Animal {
    constructor(nombre) {
        this.nombre = nombre;
        this.sonido = "🐾 Sonido de animal genérico..."; // Valor por defecto
    }

    // Método para modificar el sonido del animal
    setSonido(p_sonido) {
        this.sonido = p_sonido;
    }

    // Método genérico a ser sobrescrito por las subclases
    hacerSonido() {
        return this.sonido;
    }

    // Método común para mostrar la información del animal
    mostrarInfo() {
        return `🐾 Animal: ${this.nombre} - Sonido: ${this.hacerSonido()}`;
    }
}

// Subclase: León
class Leon extends Animal {
    constructor(nombre) {
        super(nombre);
        this.sonido = "🦁 ¡Roooaaarrr!"; // Sonido por defecto
    }
}

// Subclase: Elefante
class Elefante extends Animal {
    constructor(nombre) {
        super(nombre);
        this.sonido = "🐘 ¡Puuuuuhhh!"; // Sonido por defecto
    }
}

// Subclase: Mono
class Mono extends Animal {
    constructor(nombre) {
        super(nombre);
        this.sonido = "🐵 ¡Ooh Ooh Aah Aah!"; // Sonido por defecto
    }
}

// ✅ Ejemplo de uso
const leon = new Leon("Simba");
const elefante = new Elefante("Dumbo");
const mono = new Mono("George");

// Mostrar sonidos originales
console.log(leon.mostrarInfo());
console.log(elefante.mostrarInfo());
console.log(mono.mostrarInfo());

// Cambiar sonidos dinámicamente con setSonido()
leon.setSonido("🦁 ¡Grrrrrrr!");
elefante.setSonido("🐘 ¡Brrrrrrr!");
mono.setSonido("🐵 ¡Eeee Eeee!");

// Mostrar nuevos sonidos
console.log("\n🔄 Sonidos actualizados:");
console.log(leon.mostrarInfo());
console.log(elefante.mostrarInfo());
console.log(mono.mostrarInfo());

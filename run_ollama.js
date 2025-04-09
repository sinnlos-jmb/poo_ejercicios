const readline = require("readline");
const Ollama = require("./Ollama");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const ollama = new Ollama();

function promptUser() {
	rl.question("🧠 Escribe tu prompt: ", async userPrompt => {
		ollama.setPrompt(userPrompt);
		console.log("\n🤖 Respuesta de Ollama:\n");

		await ollama.getResponse();

		console.log("\n\n✅ Fin de la respuesta.\n");
		rl.close();
	});
}

// Configurar el modelo y opciones
ollama.setModel("phi4-mini:latest"); // o "mistral", "codellama", etc.
ollama.setSystemMessage("Eres un asistente útil.");
ollama.setOptions({ temperature: 0.5, maxTokens: 150, stream: true });

// Ejecutar
promptUser();

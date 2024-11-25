const { promises: fs } = require("fs");
const path = require("path");

// Rutas de los directorios 'dist' y 'src'
const distDir = path.resolve(__dirname, "../dist");
const srcDir = path.resolve(__dirname, "../src");

// Archivo de salida donde se escribirá el contenido
const outputFile = path.resolve(__dirname, "../code.txt");

// Separador para distinguir archivos
const separator = "/********************/";

async function processFilesInDirectory(directory) {
  try {
    // Leer los contenidos del directorio
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        // Si es una carpeta, procesar recursivamente
        await processFilesInDirectory(fullPath);
      } else if (entry.isFile()) {
        // Si es un archivo, leer su contenido
        const fileContent = await fs.readFile(fullPath, "utf-8");

        // Escribir el contenido en el archivo de salida
        await fs.appendFile(outputFile, `\n${fullPath}\n\n`);
        await fs.appendFile(outputFile, `${fileContent}\n\n`);
        await fs.appendFile(outputFile, `${separator}\n\n`);
      }
    }
  } catch (error) {
    console.error(`Error al procesar el directorio ${directory}:`, error);
  }
}

async function main() {
  try {
    // Crear un nuevo archivo de salida o limpiar el existente
    await fs.writeFile(outputFile, "");

    // Procesar los archivos dentro de 'dist' y 'src'
    console.log("Procesando archivos de 'dist'...");
    await processFilesInDirectory(distDir);
    console.log("Procesando archivos de 'src'...");
    await processFilesInDirectory(srcDir);

    console.log(`Archivos procesados y guardados en '${outputFile}'`);
  } catch (error) {
    console.error("Error al procesar los archivos:", error);
  }
}

main();

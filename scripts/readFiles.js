// post_comments/scripts/readFiles.js

const { promises: fs } = require("fs");
const path = require("path");

// Rutas de los directorios 'dist' y 'src'
const distDir = path.resolve(__dirname, "../dist");
const srcDir = path.resolve(__dirname, "../src");

// Archivos de salida y destacados
const outputFile = path.resolve(__dirname, "../code.txt");
const swaggerConfigPath = path.resolve(srcDir, "swagger.config.ts");
const envFilePath = path.resolve(__dirname, "../.env");

// Separador para distinguir archivos
const separator = "/********************/";

async function processFilesInDirectory(directory, excludeFiles = []) {
  const contents = [];
  try {
    // Leer los contenidos del directorio
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (excludeFiles.includes(fullPath)) continue;

      if (entry.isDirectory()) {
        // Si es una carpeta, procesar recursivamente
        const subContents = await processFilesInDirectory(
          fullPath,
          excludeFiles
        );
        contents.push(...subContents);
      } else if (entry.isFile()) {
        // Si es un archivo, leer su contenido
        const fileContent = await fs.readFile(fullPath, "utf-8");
        contents.push({ path: fullPath, content: fileContent });
      }
    }
  } catch (error) {
    console.error(`Error al procesar el directorio ${directory}:`, error);
  }
  return contents;
}

async function processFileIfExists(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return { path: filePath, content: fileContent };
  } catch {
    return null; // Retorna null si el archivo no existe
  }
}

async function main() {
  try {
    // Crear un nuevo archivo de salida o limpiar el existente
    await fs.writeFile(outputFile, "");

    const highlightedFiles = [];

    // Procesar archivo .env si existe
    console.log("Procesando archivo .env...");
    const envFile = await processFileIfExists(envFilePath);
    if (envFile) highlightedFiles.push(envFile);

    // Procesar archivo swagger.config.ts si existe
    console.log("Procesando archivo swagger.config.ts...");
    const swaggerFile = await processFileIfExists(swaggerConfigPath);
    if (swaggerFile) highlightedFiles.push(swaggerFile);

    // Escribir archivos destacados al inicio
    for (const { path: filePath, content } of highlightedFiles) {
      await fs.appendFile(outputFile, `\n${filePath}\n\n`);
      await fs.appendFile(outputFile, `${content}\n\n`);
      await fs.appendFile(outputFile, `${separator}\n\n`);
    }

    // Procesar los archivos dentro de 'dist' y 'src', excluyendo los destacados
    console.log("Procesando archivos de 'dist'...");
    const distContents = await processFilesInDirectory(distDir, [
      swaggerConfigPath,
      envFilePath,
    ]);
    console.log("Procesando archivos de 'src'...");
    const srcContents = await processFilesInDirectory(srcDir, [
      swaggerConfigPath,
      envFilePath,
    ]);

    // Combinar contenidos de 'dist' y 'src' y escribirlos al archivo de salida
    const allContents = [...distContents, ...srcContents];
    for (const { path: filePath, content } of allContents) {
      await fs.appendFile(outputFile, `\n${filePath}\n\n`);
      await fs.appendFile(outputFile, `${content}\n\n`);
      await fs.appendFile(outputFile, `${separator}\n\n`);
    }

    console.log(`Archivos procesados y guardados en '${outputFile}'`);
  } catch (error) {
    console.error("Error al procesar los archivos:", error);
  }
}

main();

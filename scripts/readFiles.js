// post_comments/scripts/readFiles.js

const { promises: fs } = require("fs");
const path = require("path");

// Configuración de rutas importantes
const paths = {
  distDir: path.resolve(__dirname, "../dist"),
  srcDir: path.resolve(__dirname, "../src"),
  outputFile: path.resolve(__dirname, "../code.txt"),
  swaggerConfig: path.resolve(__dirname, "../src/swagger.config.ts"),
  envFile: path.resolve(__dirname, "../.env"),
  launchConfig: path.resolve(__dirname, "../.vscode/launch.json"), // Ruta del archivo launch.json
};

// Separador para distinguir archivos
const SEPARATOR = "/********************/";

async function readDirectory(directory, excludeFiles = []) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (excludeFiles.includes(fullPath)) continue;

      if (entry.isDirectory()) {
        results.push(...(await readDirectory(fullPath, excludeFiles)));
      } else if (entry.isFile()) {
        const content = await fs.readFile(fullPath, "utf-8");
        results.push({ path: fullPath, content });
      }
    }
    return results;
  } catch (error) {
    console.error(`Error leyendo el directorio ${directory}:`, error);
    return [];
  }
}

async function readFileIfExists(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return { path: filePath, content };
  } catch {
    return null;
  }
}

async function writeToFile(filePath, content) {
  try {
    await fs.appendFile(filePath, content);
  } catch (error) {
    console.error(`Error escribiendo en el archivo ${filePath}:`, error);
  }
}

async function processHighlightedFiles(filePaths, outputFile) {
  const files = await Promise.all(filePaths.map(readFileIfExists));
  for (const file of files.filter(Boolean)) {
    await writeToFile(outputFile, `\n${file.path}\n\n`);
    await writeToFile(outputFile, `${file.content}\n\n`);
    await writeToFile(outputFile, `${SEPARATOR}\n\n`);
  }
}

async function main() {
  try {
    console.log("Iniciando procesamiento de archivos...");

    // Inicializar archivo de salida
    await fs.writeFile(paths.outputFile, "");

    // Procesar archivos destacados
    console.log("Procesando archivos destacados...");
    await processHighlightedFiles(
      [paths.envFile, paths.swaggerConfig, paths.launchConfig], // Incluye launch.json
      paths.outputFile
    );

    // Procesar directorios
    console.log("Procesando directorios...");
    const distContents = await readDirectory(paths.distDir, [
      paths.swaggerConfig,
      paths.envFile,
    ]);
    const srcContents = await readDirectory(paths.srcDir, [
      paths.swaggerConfig,
      paths.envFile,
    ]);

    // Escribir contenidos de directorios en el archivo de salida
    const allContents = [...distContents, ...srcContents];
    for (const { path: filePath, content } of allContents) {
      await writeToFile(paths.outputFile, `\n${filePath}\n\n`);
      await writeToFile(paths.outputFile, `${content}\n\n`);
      await writeToFile(paths.outputFile, `${SEPARATOR}\n\n`);
    }

    console.log(`Proceso completado. Archivo generado: ${paths.outputFile}`);
  } catch (error) {
    console.error("Error durante la ejecución principal:", error);
  }
}

main();

// import { promises as fs } from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // Obtener el directorio actual (equivalente a __dirname en CommonJS)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ruta del directorio 'src'
// const srcDir = path.resolve(__dirname, "../src"); // Ajusta la ruta correctamente
// // Ruta para guardar el archivo 'code.txt' fuera de 'src'
// const outputFile = path.resolve(__dirname, "../code.txt");
// const separator = "/********************/";

// // Archivos adicionales a incluir
// const additionalFiles = [
//   path.resolve(__dirname, "../package.json"),
//   path.resolve(__dirname, "../tsconfig.json"),
// ];

// // Función recursiva para obtener todos los archivos de un directorio y subdirectorios
// async function getFilesRecursive(directory) {
//   const entries = await fs.readdir(directory, { withFileTypes: true });
//   const files = [];

//   for (const entry of entries) {
//     const fullPath = path.join(directory, entry.name);
//     if (entry.isDirectory()) {
//       // Llamada recursiva para explorar subcarpetas
//       const subFiles = await getFilesRecursive(fullPath);
//       files.push(...subFiles);
//     } else {
//       files.push(fullPath);
//     }
//   }

//   return files;
// }

// async function processFiles() {
//   try {
//     // Obtener todos los archivos de forma recursiva desde 'src'
//     const srcFiles = await getFilesRecursive(srcDir);

//     // Combinar los archivos de 'src' con los archivos adicionales
//     const allFiles = [...srcFiles, ...additionalFiles];

//     // Crear un flujo de escritura para 'code.txt'
//     const writeStream = await fs.open(outputFile, "w");

//     for (const filePath of allFiles) {
//       try {
//         const fileContent = await fs.readFile(filePath, "utf-8");

//         // Escribir el nombre y ruta del archivo
//         await writeStream.write(`\n${filePath}\n\n`);

//         // Escribir el contenido del archivo
//         await writeStream.write(`${fileContent}\n\n`);

//         // Escribir separadores
//         await writeStream.write(`\n\n${separator}\n\n`);
//       } catch (error) {
//         console.error(`Error al leer el archivo ${filePath}:`, error);
//       }
//     }

//     // Cerrar el flujo de escritura
//     await writeStream.close();
//     console.log(`Archivos procesados y guardados en '${outputFile}'`);
//   } catch (error) {
//     console.error("Error al procesar los archivos:", error);
//   }
// }

// processFiles();

// import { promises as fs } from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const baseDir = path.resolve(__dirname, "../dist");
// const outputFile = path.resolve(__dirname, "../code.txt");
// const separator = "/********************/";

// async function processFilesInDirectory(directory) {
//   try {
//     const entries = await fs.readdir(directory, { withFileTypes: true });

//     for (const entry of entries) {
//       const fullPath = path.join(directory, entry.name);

//       if (entry.isDirectory()) {
//         await processFilesInDirectory(fullPath);
//       } else if (entry.isFile()) {
//         const fileContent = await fs.readFile(fullPath, "utf-8");

//         await fs.appendFile(outputFile, `\n${fullPath}\n\n`);
//         await fs.appendFile(outputFile, `${fileContent}\n\n`);
//         await fs.appendFile(outputFile, `${separator}\n\n`);
//       }
//     }
//   } catch (error) {
//     console.error(`Error al procesar el directorio ${directory}:`, error);
//   }
// }

// async function main() {
//   try {
//     await fs.writeFile(outputFile, "");
//     await processFilesInDirectory(baseDir);
//     console.log(`Archivos procesados y guardados en '${outputFile}'`);
//   } catch (error) {
//     console.error("Error al procesar los archivos:", error);
//   }
// }

// main();

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolver __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

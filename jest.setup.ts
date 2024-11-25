// jest.setup.ts

import { testDataSource } from "./src/ormconfig";

// Inicializar la conexión antes de correr las pruebas
beforeAll(async () => {
  if (!testDataSource.isInitialized) {
    await testDataSource.initialize();
  }
});

// Limpiar la base de datos antes de cada prueba
beforeEach(async () => {
  await testDataSource.synchronize(true);
});

// Cerrar la conexión después de todas las pruebas
afterAll(async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.dropDatabase();
    await testDataSource.destroy();
  }
});

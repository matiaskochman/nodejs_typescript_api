// src/index.ts
import dotenv from "dotenv";

// Cargar variables de entorno desde .env
dotenv.config();

import "reflect-metadata";
import { AppDataSource } from "./ormconfig";
import app from "./app";

const PORT = 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

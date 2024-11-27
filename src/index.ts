import dotenv from "dotenv";
import "reflect-metadata"; // Importa reflect-metadata si estás usando TypeORM
import { dataSource } from "./ormconfig";
import app from "./app";

dotenv.config();

const PORT = 3000;

async function startServer() {
  try {
    await dataSource.initialize();
    console.log("Data Source has been initialized!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}

startServer();

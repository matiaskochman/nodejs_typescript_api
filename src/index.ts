import "reflect-metadata";
import { AppDataSource } from "./ormconfig.js";
import app from "./app.js";

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

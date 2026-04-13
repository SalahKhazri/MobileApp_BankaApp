// src/server.js
import { ENV } from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";


const startServer = async () => {
  await connectDB(); // Connexion MongoDB en premier

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${ENV.PORT} [${ENV.NODE_ENV}]`);
  });
};

startServer();
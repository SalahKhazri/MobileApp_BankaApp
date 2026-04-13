import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    //Serveur
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV ||  "developpment",

    //Base de données
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/banka",

    //JWT
    JWT_SECRET: process.env.JWT_SECRET || "secret_key_dev",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};
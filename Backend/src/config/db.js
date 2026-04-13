import mongoose from "mongoose";
import {ENV} from './env.js';

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(ENV.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB connecté : ${conn.connection.host}`)
    }
    catch (error){
        console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1); // Arrêt du serveur si la DB est inaccessible
    }
};

export default connectDB;
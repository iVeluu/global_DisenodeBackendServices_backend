import express from 'express'
import dotenv from 'dotenv';
import cors from "cors";

import { connectDB } from './config/db';
import { corsOptions } from './config/cors';
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

//config para variables de entorno
dotenv.config()

//Conectar a la base de datos
connectDB();

export const server = express();

//Habilitar las opciones del cors
server.use(cors(corsOptions))

//Habilitar la lectura de json
server.use(express.json())

//routes
server.use("/api/auth", authRoutes);
server.use("/api/task", taskRoutes);


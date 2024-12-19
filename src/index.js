import express from "express";
import { PORT } from "./config.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import cors from 'cors'
import morgan from "morgan";
import cookieParser from 'cookie-parser'

const app = express();

//middlewares
app.use(morgan("dev"));
app.use(cookieParser())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

//Rutas
app.get("/", (req, res) => res.json({ message: "Bienvenido a la API  de pruebas" }))
app.use('/api', authRoutes);
app.use('/api', taskRoutes);

//error hander
app.use((err, req, res, next) => {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  });  

app.listen(PORT);

console.log(`Server corriendo en el puerto: ${PORT}`);

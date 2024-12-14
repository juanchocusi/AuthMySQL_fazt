import express from "express";
import { PORT } from "./config.js";
/* import indexRoutes from "./routes/index.routes.js"; */
import taskRoutes from "./routes/task.routes.js";
import cors from 'cors'
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

/* app.use(indexRoutes); */
app.use(taskRoutes);

app.listen(PORT);

console.log(`Server corriendo en el puerto: ${PORT}`);

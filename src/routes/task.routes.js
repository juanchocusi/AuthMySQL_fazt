import  Router  from "express-promise-router";
import {
  getAllTask,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller.js";
import {isAuth} from '../middlewares/auth.middleware.js'

const router = Router();

router.get("/tasks", isAuth, getAllTask);

router.get("/tasks/:id", isAuth, getTask);

router.post("/tasks", isAuth, createTask);

router.put("/tasks/:id", isAuth, updateTask);

router.delete("/tasks/:id", isAuth, deleteTask);

export default router;

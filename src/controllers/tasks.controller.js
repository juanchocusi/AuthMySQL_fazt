import { pool } from "../db.js";

export const getAllTask = async (req, res) => {
  console.log("user:",req.userId)
   const [result] = await pool.query(
    "SELECT * FROM tasks order by createAt ASC"
  );
  return res.json(result);
  /* try {
    const [result] = await pool.query(
      "SELECT * FROM tasks order by createAt ASC"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  } */
};

export const getTask = async (req, res) => {
  try {
    const [result] = await pool.query("select * from tasks where id = ?", [
      req.params.id,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Tarea no existe..." });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description) VALUES (?, ?)",
      [title, description]
    );
    res.json({ id: result.insertId, title, description });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const result = await pool.query("update tasks set ? where id = ?", [
      req.body,
      req.params.id,
    ]);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const [result] = await pool.query("delete from tasks where id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Eiminado" });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

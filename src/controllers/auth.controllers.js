import bcrypt from "bcrypt";
import { pool } from "../db.js";
import { createAccessToken } from "../libs/jwt.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query("select * from users where email = ?",
    [email]);

  if (result.length === 0) {
    return res.status(400).json({ message: "correo no registrado" });
  }

  const validPassword = await bcrypt.compare(password, result[0].password);

  if (!validPassword) {
    return res.status(400).json({ message: "pass incorrecto..." });
  }
  const token = await createAccessToken({ id: result.insertId });

  res.cookie("token", token, {
    httpOnly: true,
    //secure; true,
    sameSie: "none",
    maxAge: 24 * 60 * 60 * 100, //1 dia
  });
  return res.json(result[0]);
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    /* Insertar el nuevo usuario */
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    /* Obtener el usuario insertado */
    const [insertedUser] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [result.insertId]
    );
    const token = await createAccessToken({ id: result.insertId });

    res.cookie("token", token, {
      httpOnly: true,
      //secure; true,
      sameSie: "none",
      maxAge: 24 * 60 * 60 * 100, //1 dia
    });
    /*     console.log(insertedUser); */
    return res.json(insertedUser[0]);
    /* return res.json({token: token}) */
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signout = (req, res) => res.send("cerrando sesion");
export const profile = (req, res) => res.send("perfil de usuario");

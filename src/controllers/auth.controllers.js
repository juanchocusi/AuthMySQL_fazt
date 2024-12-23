import bcrypt from "bcrypt";
import { pool } from "../db.js";
import { createAccessToken } from "../libs/jwt.js";
import md5 from 'md5'

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query("select * from users where email = ?",
    [email]);
  
  if (rows.length === 0) {
    return res.status(400).json({ message: "correo no registrado" });
  }
  
  const user = rows[0];
  console.log("signin:",user)
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: "pass incorrecto..." });
  }
  const token = await createAccessToken({ id: user.id });

  res.cookie("token", token, {
    httpOnly: true,
    //secure; true,
    sameSie: "none",
    maxAge: 24 * 60 * 60 * 100, //1 dia
  });
  return res.json(user);
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const gravatar = `https://www.gravatar.com/avatar/${md5(email)}`
    /* Insertar el nuevo usuario */
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, gravatar) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, gravatar]
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
    next(error);
  }
  
};

export const signout = (req, res) => {
  res.clearCookie('token');
  res.sendStatus(200);
};

export const profile = async(req, res) => {
  const [rows] = await pool.query("select * from users where id = ?", [req.userId]);
  return res.json(rows[0]);
};

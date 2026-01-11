import { pool } from "../db.js";

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo usuarios:", err);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password_hash } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password_hash]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creando usuario:", err);
    res.status(500).json({ error: "Error creando usuario" });
  }
};

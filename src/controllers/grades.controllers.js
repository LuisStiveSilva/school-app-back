import { getConnection, sql } from "../database/connection.js"

export const getGrades = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM grados");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getTeachersGrades = async (req, res) => {
  try {
    const { id_profesor } = req.body
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id_profesor", sql.Int, id_profesor)
      .query(`
        SELECT DISTINCT
            g.id AS id,
            g.nombre AS nombre
        FROM
            cursos c
        JOIN
            profesores p ON c.id_profesor = p.id
        JOIN
            grados g ON c.id_grado = g.id
        WHERE
            p.id = @id_profesor        
            `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getGrade = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("SELECT * FROM grados WHERE id = @id");

    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const createGrade = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .query(
        "INSERT INTO grados (nombre) VALUES (@nombre); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      nombre,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const editGrade = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", req.params.id)
      .input("nombre", sql.VarChar, nombre)
      .query(
        "UPDATE grados SET nombre=@nombre WHERE id = @id"
      );
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);
    res.json({
      nombre,
      id: req.params.id
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const deleteGrade = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("DELETE FROM grados WHERE id = @id");

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
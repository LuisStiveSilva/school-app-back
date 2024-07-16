import { getConnection, sql } from "../database/connection.js"

export const getInscriptions = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM inscripciones");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getInscription = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("SELECT * FROM inscripciones WHERE id = @id");

    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const createInscription = async (req, res) => {
  const { id_estudiante, id_asesoria } = req.body;

  if (!id_estudiante || !id_asesoria) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id_estudiante", sql.Int, id_estudiante)
      .input("id_asesoria", sql.Int, id_asesoria)
      .query(
        "INSERT INTO inscripciones (id_estudiante,id_asesoria) VALUES (@id_estudiante,@id_asesoria); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      id_estudiante,
      id_asesoria,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const editInscription = async (req, res) => {
  const { id_estudiante, id_curso } = req.body;

  if (!id_estudiante || !id_curso) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", req.params.id)
      .input("id_estudiante", sql.Int, id_estudiante)
      .input("id_curso", sql.Int, id_curso)
      .query(
        "UPDATE inscripciones SET id_estudiante=@id_estudiante,id_curso=@id_curso  WHERE id = @id"
      );
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);
    res.json({
      id_estudiante,
      id_curso,
      id: req.params.id
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const deleteInscription = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("DELETE FROM inscripciones WHERE id = @id");

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
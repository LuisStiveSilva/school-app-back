import { getConnection, sql } from "../database/connection.js"

export const getSessions = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM sesionCurso");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getSession = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("SELECT * FROM sesionCurso WHERE id = @id");
    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getSessionByCourse = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id_curso", req.params.id_curso)
      .query("SELECT * FROM sesionCurso WHERE id_curso = @id_curso");

    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const createSession = async (req, res) => {
  const { dia, desde, hasta, aula, id_curso } = req.body;

  if (!dia || !desde || !hasta || !aula || !id_curso) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("dia", sql.VarChar, dia)
      .input("desde", sql.VarChar, desde)
      .input("hasta", sql.VarChar, hasta)
      .input("aula", sql.VarChar, aula)
      .input("id_curso", sql.Int, id_curso)
      .query(
        "INSERT INTO sesionCurso (dia,desde,hasta,aula,id_curso) VALUES (@dia,@desde,@hasta,@aula,@id_curso); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      dia,
      desde,
      hasta,
      aula,
      id_curso,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const editSession = async (req, res) => {
  const { dia, desde, hasta, aula, id_curso } = req.body;

  if (!dia || !desde || !hasta || !aula || !id_curso) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", req.params.id)
      .input("dia", sql.VarChar, dia)
      .input("desde", sql.VarChar, desde)
      .input("hasta", sql.VarChar, hasta)
      .input("aula", sql.VarChar, aula)
      .input("id_curso", sql.Int, id_curso)
      .query(
        "UPDATE sesionCurso SET dia = @dia,desde = @desde,hasta = @hasta,aula = @aula,id_curso = @id_curso WHERE id = @id"
      );
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);
    res.json({
      dia,
      desde,
      hasta,
      aula,
      id_curso,
      id: req.params.id
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const deleteSession = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("DELETE FROM sesionCurso WHERE id = @id");

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
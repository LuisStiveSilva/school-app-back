import { getConnection, sql } from "../database/connection.js"

export const getCalifications = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM calificaciones");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getCalification = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("SELECT * FROM calificaciones WHERE id = @id");

    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getCalificationsByStudent = async (req, res) => {
  const { id_estudiante } = req.body
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id_estudiante", sql.Int, id_estudiante)
      .query(`
SELECT
    c.id AS id_curso,
    c.nombre AS curso,
    (
        SELECT
            ca.id AS id_calificacion,
            ca.id_estudiante,
            ca.nota,
            ca.periodo
        FROM
            calificaciones ca
        WHERE
            ca.id_curso = c.id
            AND ca.id_estudiante = @id_estudiante -- Filtra por el ID del estudiante
        FOR JSON PATH
    ) AS calificaciones
FROM
    cursos c;
        `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const createCalification = async (req, res) => {
  const { nota, periodo, id_estudiante, id_curso } = req.body;

  if (!id_estudiante || !id_curso || !nota || !periodo) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("nota", sql.Decimal, nota)
      .input("periodo", sql.VarChar, periodo)
      .input("id_estudiante", sql.Int, id_estudiante)
      .input("id_curso", sql.Int, id_curso)
      .query(
        "INSERT INTO calificaciones (id_estudiante,id_curso,nota,periodo) VALUES (@id_estudiante,@id_curso,@nota,@periodo); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      id_estudiante,
      id_curso,
      nota,
      periodo,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const editCalification = async (req, res) => {
  const { id_estudiante, id_curso, nota, periodo } = req.body;

  if (!id_estudiante || !id_curso || !nota || !periodo) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", req.params.id)
      .input("nota", sql.Decimal, nota)
      .input("periodo", sql.VarChar, periodo)
      .input("id_estudiante", sql.Int, id_estudiante)
      .input("id_curso", sql.Int, id_curso)
      .query(
        "UPDATE calificaciones SET id_estudiante=@id_estudiante,id_curso=@id_curso,nota=@nota,periodo=@periodo  WHERE id = @id"
      );
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);
    res.json({
      id_estudiante,
      id_curso,
      nota,
      periodo,
      id: req.params.id
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const deleteCalification = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("DELETE FROM calificaciones WHERE id = @id");

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
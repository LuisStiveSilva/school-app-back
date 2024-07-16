import { getConnection, sql } from "../database/connection.js"

// CREATE TABLE asistencias
// (
//   id INT IDENTITY(1,1) PRIMARY KEY,
//   fecha DATE,
//   id_curso INT FOREIGN KEY REFERENCES cursos(id),
//   id_estudiante INT FOREIGN KEY REFERENCES estudiantes(id),
//   asistencia BIT
// );

export const getAssists = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM asistencias");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getAssistByDate = async (req, res) => {
  const { id_curso, fecha } = req.body;

  if (!fecha || !id_curso) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id_curso", sql.Int, id_curso)
      .input("fecha", sql.Date, fecha)
      .query(`
          SELECT 
              e.id AS id_estudiante,
              e.nombre,
              e.apellido,
              ISNULL(a.asistencia, NULL) AS asistencia,
              ISNULL(a.id, NULL) AS id_asistencia
          FROM 
              estudiantes e
          LEFT JOIN 
              asistencias a ON e.id = a.id_estudiante
                          AND a.id_curso = @id_curso
                          AND a.fecha = @fecha
          ORDER BY 
              e.id;`
      );
    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const createAssist = async (req, res) => {
  const { fecha, id_curso, id_estudiante, asistencia } = req.body
  if (!fecha || !id_curso || !id_estudiante) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .input("id_curso", sql.Int, id_curso)
      .input("id_estudiante", sql.Int, id_estudiante)
      .input("asistencia", sql.Bit, asistencia)
      .query(
        "INSERT INTO asistencias (fecha, id_curso, id_estudiante, asistencia) VALUES (@fecha, @id_curso, @id_estudiante, @asistencia); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      fecha,
      id_curso,
      id_estudiante,
      asistencia,
      id: result.recordset[0].id
    })
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getStudentsAssists = async (req, res) => {
  const { id_estudiante } = req.body
  try {
    const pool = await getConnection()
    const result = await pool
      .request()
      .input("id_estudiante", sql.Int, id_estudiante)
      .query(`
SELECT
    c.id AS id_curso,
    c.nombre AS curso,
    '[' + ISNULL(STUFF((
        SELECT
            ', ' + 
            '{ "id_asistencia": ' + CAST(a.id AS VARCHAR(10)) +
            ', "fecha": "' + CONVERT(VARCHAR(10), a.fecha, 120) + '"' +
            ', "asistencia": ' + CAST(a.asistencia AS VARCHAR(5)) +
            ' }'
        FROM
            asistencias a
        WHERE
            a.id_curso = c.id
            AND a.id_estudiante = @id_estudiante
        FOR XML PATH(''), TYPE
    ).value('.', 'VARCHAR(MAX)'), 1, 2, ''), '') + ']' AS asistencias
FROM
    cursos c;
        `)
    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const editAssist = async (req, res) => {
  const { id_curso, id_estudiante, asistencia } = req.body
  if (!id_curso || !id_estudiante) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", req.params.id)
      .input("id_curso", sql.Int, id_curso)
      .input("id_estudiante", sql.Int, id_estudiante)
      .input("asistencia", sql.Bit, asistencia)
      .query(
        "UPDATE asistencias SET id_curso = @id_curso, id_estudiante = @id_estudiante, asistencia = @asistencia WHERE id = @id"
      );
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);
    res.json({
      id_curso,
      id_estudiante,
      asistencia,
      id: req.params.id
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
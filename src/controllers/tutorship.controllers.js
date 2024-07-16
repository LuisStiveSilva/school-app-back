import { getConnection, sql } from "../database/connection.js"

export const getTutorships = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
          a.id AS id_asesoria,
          a.fecha,
          a.desde,
          a.hasta,
          a.id_profesor,
          a.id_curso,
          CONCAT(p.apellido, ' ', p.nombre) AS profesor,
          c.nombre AS curso,
          c.id_grado AS id_grado
      FROM 
          asesorias a
          INNER JOIN profesores p ON a.id_profesor = p.id
          INNER JOIN cursos c ON a.id_curso = c.id;      
      `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getTutorship = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("SELECT * FROM asesorias WHERE id = @id");

    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getTutorshipByGrade = async (req, res) => {
  try {
    const { id_grado, id_estudiante } = req.body
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id_grado", sql.Int, id_grado)
      .input("id_estudiante", sql.Int, id_estudiante)
      .query(`
        SELECT DISTINCT
            a.id AS id_asesoria,
            c.id AS id_curso,
            i.id AS id_inscripcion,
            a.fecha,
            a.desde,
            a.hasta,
            CONCAT(p.nombre, ' ', p.apellido) AS profesor,
            c.nombre AS curso,
            CASE WHEN i.id_estudiante IS NOT NULL THEN 'true' ELSE 'false' END AS asistencia
        FROM 
            asesorias a
            INNER JOIN cursos c ON a.id_curso = c.id
            INNER JOIN profesores p ON a.id_profesor = p.id
            INNER JOIN grados g ON c.id_grado = g.id
            INNER JOIN estudiantes e ON g.id = e.id_grado
            LEFT JOIN inscripciones i ON a.id = i.id_asesoria AND i.id_estudiante = @id_estudiante
        WHERE 
            e.id_grado = @id_grado;
      `);

    console.log(result.recordset)
    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getTeacherTutorships = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id_profesor", req.params.id_profesor)
      .query(`
        SELECT
            a.id AS id_asesoria,
            a.fecha,
            a.desde,
            a.hasta,
            c.nombre AS nombre_curso
        FROM 
            asesorias a
            INNER JOIN profesores p ON a.id_profesor = p.id
            INNER JOIN cursos c ON a.id_curso = c.id
        WHERE 
            p.id = @id_profesor
            AND a.fecha >= CONVERT(DATE, GETDATE());
      `);

    console.log(result.recordset)
    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}


export const getTutorshipByTeacherDate = async (req, res) => {
  try {
    const { fecha, id_profesor } = req.body
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id_profesor", sql.Int, id_profesor)
      .input("fecha", sql.Date, fecha)
      .query(`
        SELECT
            a.id AS id_asesoria,
            a.fecha,
            a.desde,
            a.hasta,
            c.nombre AS nombre_curso
        FROM 
            asesorias a
            INNER JOIN profesores p ON a.id_profesor = p.id
            INNER JOIN cursos c ON a.id_curso = c.id
        WHERE 
            p.id = @id_profesor
            AND a.fecha >= @fecha;
      `);

    console.log(result.recordset)
    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const createTutorship = async (req, res) => {
  const { fecha, desde, hasta, id_profesor, id_curso } = req.body;

  if (!fecha || !desde || !hasta || !id_profesor || !id_curso) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("fecha", sql.Date, fecha)
      .input("desde", sql.VarChar, desde)
      .input("hasta", sql.VarChar, hasta)
      .input("id_profesor", sql.Int, id_profesor)
      .input("id_curso", sql.Int, id_curso)
      .query(
        "INSERT INTO asesorias (fecha,desde,hasta,id_profesor,id_curso) VALUES (@fecha,@desde,@hasta,@id_profesor,@id_curso); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      fecha,
      desde,
      hasta,
      id_profesor,
      id_curso,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const editTutorship = async (req, res) => {
  const { fecha, desde, hasta, id_profesor, id_curso } = req.body;

  if (!fecha || !desde || !hasta || !id_profesor || !id_curso) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", req.params.id)
      .input("fecha", sql.Date, fecha)
      .input("desde", sql.VarChar, desde)
      .input("hasta", sql.VarChar, hasta)
      .input("id_profesor", sql.Int, id_profesor)
      .input("id_curso", sql.Int, id_curso)
      .query(
        "UPDATE asesorias SET fecha=@fecha,desde=@desde,hasta=@hasta,id_profesor=@id_profesor,id_curso=@id_curso WHERE id = @id"
      );
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);
    res.json({
      fecha,
      desde,
      hasta,
      id_profesor,
      id_curso,
      id: req.params.id
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const deleteTutorship = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("DELETE FROM asesorias WHERE id = @id");

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
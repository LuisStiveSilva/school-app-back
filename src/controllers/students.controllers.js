import { getConnection, sql } from "../database/connection.js"

export const getStudents = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM estudiantes");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getStudent = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("SELECT * FROM estudiantes WHERE id = @id");
    
    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getStudentsByGrade = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id_grado", req.params.id_grado)
      .query("SELECT * FROM estudiantes WHERE id_grado = @id_grado");

    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getStudentsByCourse = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id_curso", req.params.id_curso)
      .query(`
        SELECT e.id, e.nombre, e.apellido, e.correo, e.fecha_nacimiento, e.dni
        FROM estudiantes e
        JOIN grados g ON e.id_grado = g.id
        JOIN cursos c ON c.id_grado = g.id
        WHERE c.id = @id_curso;
      `);

    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const createStudent = async (req, res) => {
  const { nombre, apellido, correo, password, fecha_nacimiento, dni, id_grado } = req.body;

  if (!apellido || !nombre || !correo || !password || !fecha_nacimiento || !dni || !id_grado) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("correo", sql.VarChar, correo)
      .input("password", sql.VarChar, password)
      .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
      .input("dni", sql.VarChar, dni)
      .input("id_grado", sql.Int, id_grado)
      .query(
        "INSERT INTO estudiantes (nombre, apellido, correo, password, fecha_nacimiento, dni, id_grado) VALUES (@nombre,@apellido,@correo,@password,@fecha_nacimiento,@dni,@id_grado); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      nombre,
      apellido,
      correo,
      password,
      fecha_nacimiento,
      dni,
      id_grado,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const editStudent = async (req, res) => {
  const { nombre, apellido, correo, password, fecha_nacimiento, dni } = req.body;

  if (!apellido || !nombre || !correo || !password || !fecha_nacimiento || !dni ) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", req.params.id)
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("correo", sql.VarChar, correo)
      .input("password", sql.VarChar, password)
      .input("fecha_nacimiento", sql.Date, fecha_nacimiento)
      .input("dni", sql.VarChar, dni)
      .query(
        "UPDATE estudiantes SET nombre = @nombre, apellido = @apellido, correo = @correo, password = @password, fecha_nacimiento = @fecha_nacimiento, dni = @dni WHERE id = @id"
      );
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);
    res.json({
      nombre,
      apellido,
      correo,
      password,
      fecha_nacimiento,
      dni,
      id: req.params.id
    });
  } catch (error) {
    console.log(error)
    res.status(500);
    res.send(error.message);
  }
}

export const deleteStudent = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("DELETE FROM estudiantes WHERE id = @id");
    console.log({ id: req.params.id, result: result })
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getStudentsCalificationsByCourse = async (req, res) => {
  const { id_curso } = req.body
  if (!id_curso) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }
  try {
    const pool = await getConnection()
    console.log("entre pool")
    const result = await pool
      .request()
      .input("id_curso", sql.Int, id_curso)
      // .query("SELECT e.nombre AS nombre_estudiante, e.apellido AS apellido_estudiante, c.nota, c.periodo FROM calificaciones c JOIN estudiantes e ON c.id_estudiante = e.id WHERE c.id_curso = @id_curso;");
      .query(`
        SELECT e.nombre, e.apellido, e.id AS id_estudiante,
        ISNULL(c.nota, 0) AS nota,
        ISNULL(c.periodo, NULL) AS periodo,
        c.id AS id_calificacion
        FROM estudiantes e
        LEFT JOIN calificaciones c ON c.id_estudiante = e.id AND c.id_curso = @id_curso;  
      `)
    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
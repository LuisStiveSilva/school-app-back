import { getConnection, sql } from "../database/connection.js"

export const getTeachers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM profesores");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getTeacher = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("SELECT * FROM profesores WHERE id = @id");

    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getTeacherSchedule = async (req, res) => {
  const { id_profesor, id_grado } = req.body;
  console.log(req.body)
  if (!id_profesor || !id_grado) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }
  try {
    const pool = await getConnection();
    const courses = await pool
      .request()
      .input("id_grado", sql.Int, id_grado)
      .input("id_profesor", sql.Int, id_profesor)
      .query("SELECT * FROM cursos WHERE id_profesor = @id_profesor AND id_grado = @id_grado");

    if (courses.recordset.length == 0) return res.status(400).json({ msg: "Error. No se encontraron cursos" });

    for (const course of courses.recordset) {
      const responseSchedule = await pool
        .request()
        .input("id_curso", sql.Int, course.id)
        .query("SELECT * FROM sesionCurso WHERE id_curso = @id_curso")
      console.log(responseSchedule.recordset)
      if (responseSchedule.recordset.length > 0) {
        course.horario = responseSchedule.recordset
      }
    }
    console.log(courses.recordset)
    return res.json(courses.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const createTeacher = async (req, res) => {
  const { nombre, apellido, correo, password, dni, especialidad } = req.body;

  if (!apellido || !nombre || !correo || !password || !dni || !especialidad) {
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
      .input("dni", sql.VarChar, dni)
      .input("especialidad", sql.VarChar, especialidad)
      .query(
        "INSERT INTO profesores (nombre, apellido, correo, password, dni, especialidad) VALUES (@nombre,@apellido,@correo,@password,@dni,@especialidad); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      nombre,
      apellido,
      correo,
      password,
      dni,
      especialidad,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const editTeacher = async (req, res) => {
  const { nombre, apellido, correo, password, dni, especialidad } = req.body;

  if (!apellido || !nombre || !correo || !password || !dni || !especialidad) {
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
      .input("dni", sql.VarChar, dni)
      .input("especialidad", sql.VarChar, especialidad)
      .query(
        "UPDATE profesores SET nombre = @nombre, apellido = @apellido, correo = @correo, password = @password, dni = @dni, especialidad = @especialidad WHERE id = @id"
      );
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);
    res.json({
      nombre,
      apellido,
      correo,
      password,
      dni,
      especialidad,
      id: req.params.id
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const deleteTeacher = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("DELETE FROM profesores WHERE id = @id");

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    console.log(error)
    res.status(500);
    res.send(error.message);
  }
}
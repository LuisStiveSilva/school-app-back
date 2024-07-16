import { getConnection, sql } from "../database/connection.js"

export const getCourses = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM cursos");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getCourseByGrade = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id_grado", req.params.id_grado)
      .query("SELECT * FROM cursos WHERE id_grado = @id_grado");
    console.log(result)
    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getStudentsCoursesSchedule = async (req, res) => {
  const { id_grado } = req.body;
  if (!id_grado) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }
  try {
    const pool = await getConnection()
    const courses = await pool
      .request()
      .input("id_grado", sql.Int, id_grado)
      .query("SELECT * FROM cursos WHERE id_grado = @id_grado");
    if (courses.recordset.length == 0) return res.status(400).json({ msg: "Error. No se encontraron cursos" });

    for (const course of courses.recordset) {
      const responseSchedule = await pool
        .request()
        .input("id_curso", sql.Int, course.id)
        .query("SELECT * FROM sesionCurso WHERE id_curso = @id_curso")
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

export const getCourseByGradeAndTeacher = async (req, res) => {
  try {
    const { id_profesor, id_grado } = req.body;

    if (!id_profesor || !id_grado) {
      return res.status(400).json({ msg: "Error. Complete todos los campos" });
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id_profesor", sql.Int, id_profesor)
      .input("id_grado", sql.Int, id_grado)
      .query("SELECT * FROM cursos WHERE id_grado = @id_grado AND id_profesor = @id_profesor");
    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const getCourse = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("SELECT * FROM cursos WHERE id = @id");

    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const createCourse = async (req, res) => {
  const { nombre, codigo, id_profesor, id_grado } = req.body;

  if (!nombre || !codigo || !id_profesor || !id_grado) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("codigo", sql.VarChar, codigo)
      .input("id_profesor", sql.Int, id_profesor)
      .input("id_grado", sql.Int, id_grado)
      .query(
        "INSERT INTO cursos (nombre, codigo, id_profesor, id_grado) VALUES (@nombre,@codigo,@id_profesor,@id_grado); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      nombre,
      codigo,
      id_profesor,
      id_grado,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const editCourse = async (req, res) => {
  const { nombre, codigo, id_profesor, id_grado } = req.body;

  if (!nombre || !codigo || !id_profesor || !id_grado) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", req.params.id)
      .input("nombre", sql.VarChar, nombre)
      .input("codigo", sql.VarChar, codigo)
      .input("id_profesor", sql.Int, id_profesor)
      .input("id_grado", sql.Int, id_grado)
      .query(
        "UPDATE cursos SET nombre = @nombre, codigo = @codigo, id_profesor = @id_profesor, id_grado = @id_grado  WHERE id = @id"
      );
    if (result.rowsAffected[0] === 0) return res.sendStatus(404);
    res.json({
      nombre,
      codigo,
      id_profesor,
      id_grado,
      id: req.params.id
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

export const deleteCourse = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", req.params.id)
      .query("DELETE FROM cursos WHERE id = @id");

    if (result.rowsAffected[0] === 0) return res.sendStatus(404);

    return res.sendStatus(204);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
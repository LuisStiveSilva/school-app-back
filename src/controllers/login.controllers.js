import { getConnection, sql } from "../database/connection.js"

export const login = async (req, res) => {
  const { dni, password } = req.body;

  if (!dni || !password) {
    return res.status(400).json({ msg: "Error. Complete todos los campos" });
  }

  try {
    const pool = await getConnection();

    let result = await pool
      .request()
      .input("dni", sql.VarChar, dni)
      .input("password", sql.VarChar, password)
      .query("SELECT * FROM profesores WHERE dni = @dni AND password = @password");
    if (result.recordset[0]) {
      let formatedResult = { ...result.recordset[0], rol: 'teacher' }
      return res.json(formatedResult);
    } else {
      let resultStudent = await pool
        .request()
        .input("dni", sql.VarChar, dni)
        .input("password", sql.VarChar, password)
        .query("SELECT * FROM estudiantes WHERE dni = @dni AND password = @password");
      if (resultStudent.recordset[0]) {
        let formatedResult = { ...resultStudent.recordset[0], rol: 'student' }
        return res.json(formatedResult);
      } else {
        res.status(404).json({ msg: "Error. Usuario no encontrado" });
      }
    }
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
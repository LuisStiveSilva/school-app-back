import app from "../src/app";
import request from "supertest"


describe("GET /students", () => {
  test("Debe responder con un status 200", async () => {
    const response = await request(app).get("/students").send();
    expect(response.statusCode).toBe(200);
  });

  test("Debe responder con un array", async () => {
    const response = await request(app).get("/students").send();
    expect(response.body).toBeInstanceOf(Array);
  });
});


describe("GET /students/:id", () => {
  test("Debe responder con un status 200", async () => {
    const response = await request(app).get("/students/4").send();
    console.log(response.statusCode)
    expect(response.statusCode).toBe(200);
  });

  test("Debe responder con un objeto", async () => {
    const response = await request(app).get("/student/4").send();
    expect(response.body).toBeInstanceOf(Object);
  });
});


describe("GET /studentsByGrade/:id_grado", () => {
  test("Debe responder con un status 200", async () => {
    const response = await request(app).get("/studentsByGrade/1").send();
    console.log(response.statusCode)
    expect(response.statusCode).toBe(200);
  });

  test("Debe responder con un objeto", async () => {
    const response = await request(app).get("/studentsByGrade/1").send();
    expect(response.body).toBeInstanceOf(Array);
  });
});

// describe("POST /students", () => {
//   describe("Con datos", () => {
//     const newStudent = {
//       "nombre": "Alumno",
//       "apellido": "Nuevo",
//       "correo": "alumno@gmail.com",
//       "password": "password",
//       "fecha_nacimiento": "2024-07-06",
//       "dni": "12345678"
//     };

//     test("Debe responder con un status 200", async () => {
//       const response = await request(app).post("/students").send(newStudent);
//       expect(response.statusCode).toBe(200);
//     });

//     test("Debe responder con el id nuevo", async () => {
//       const response = await request(app).post("/students").send(newStudent);
//       expect(response.body.id).toBeDefined();
//     });
//   });

//   describe("Cuando faltan datos", () => {
//     test("Debe responder con un status 400", async () => {
//       const fields = [
//         { nombre: "Alumno" },
//         { apellido: "nuevo" },
//         { correo: "correo" },
//         { password: "password" },
//         { fecha_nacimiento: "2024-07-06" },
//         { dni: "12345678" },
//       ];

//       for (const body of fields) {
//         const response = await request(app).post("/students").send(body);
//         expect(response.statusCode).toBe(400);
//       }
//     });
//   });
// });
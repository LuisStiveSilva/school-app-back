DROP DATABASE schoolapp
CREATE DATABASE schoolapp
USE schoolapp

DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS profesores;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS asesorias;
DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS calificaciones;
DROP TABLE IF EXISTS grados;
DROP TABLE IF EXISTS sesionCurso;

CREATE TABLE grados
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  nombre VARCHAR(20),
);

CREATE TABLE estudiantes
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  nombre VARCHAR(20),
  apellido VARCHAR(20),
  correo VARCHAR(30),
  password VARCHAR(20),
  fecha_nacimiento DATE,
  dni VARCHAR(8),
  id_grado INT FOREIGN KEY REFERENCES grados(id),
);

CREATE TABLE profesores
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  nombre VARCHAR(20),
  apellido VARCHAR(20),
  correo VARCHAR(30),
  password VARCHAR(20),
  especialidad VARCHAR(20),
  dni VARCHAR(8),
);

CREATE TABLE cursos
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  nombre VARCHAR(20),
  codigo VARCHAR(5),
  id_profesor INT FOREIGN KEY REFERENCES profesores(id),
  id_grado INT FOREIGN KEY REFERENCES grados(id)
);

CREATE TABLE sesionCurso
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  dia VARCHAR(20),
  desde VARCHAR(10),
  hasta VARCHAR(10),
  aula VARCHAR(10),
  id_curso INT FOREIGN KEY REFERENCES cursos(id)
);

CREATE TABLE asesorias
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  fecha DATE,
  desde VARCHAR(10),
  hasta VARCHAR(10),
  id_profesor INT FOREIGN KEY REFERENCES profesores(id),
  id_curso INT FOREIGN KEY REFERENCES cursos(id),
);

CREATE TABLE inscripciones
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_estudiante INT FOREIGN KEY REFERENCES estudiantes(id),
  id_asesoria INT FOREIGN KEY REFERENCES asesorias(id),
);

CREATE TABLE calificaciones
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  nota DECIMAL (5,2),
  periodo VARCHAR(20),
  id_curso INT FOREIGN KEY REFERENCES cursos(id),
  id_estudiante INT FOREIGN KEY REFERENCES estudiantes(id),
);

CREATE TABLE asistencias
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  fecha DATE,
  id_curso INT FOREIGN KEY REFERENCES cursos(id),
  id_estudiante INT FOREIGN KEY REFERENCES estudiantes(id),
  asistencia BIT
);

CREATE TABLE asistenciaAsesoria
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_asesoria INT FOREIGN KEY REFERENCES asesorias(id),
  id_estudiante INT FOREIGN KEY REFERENCES estudiantes(id),
  asistencia BIT
)

-- DATOS ESTUDIANTES
INSERT INTO estudiantes
  (nombre, apellido, correo, password, fecha_nacimiento, dni, id_grado)
VALUES
  ('Ana', 'López', 'ana@example.com', 'password', '2000-09-15', '12345678', 2),
  ('Pedro', 'Sánchez', 'pedro@example.com', 'password', '2001-07-25', '87654321', 2),
  ('Sofía', 'Díaz', 'sofia@example.com', 'password', '2002-04-12', '98765432', 2),
  ('Javier', 'Ruiz', 'javier@example.com', 'password', '2003-11-30', '23456789', 2),
  ('Isabel', 'Gómez', 'isabel@example.com', 'password', '2004-03-08', '34567890', 2),
  ('Daniel', 'Hernández', 'daniel@example.com', 'password', '2005-01-17', '45678901', 2),
  ('Lucía', 'Torres', 'lucia@example.com', 'password', '2006-06-23', '56789012', 2),
  ('Martín', 'Ramírez', 'martin@example.com', 'password', '2007-12-05', '67890123', 2),
  ('Elena', 'Vargas', 'elena@example.com', 'password', '2008-10-14', '78901234', 2),
  ('Hugo', 'Fernández', 'hugo@example.com', 'password', '2009-09-02', '89012345', 2);
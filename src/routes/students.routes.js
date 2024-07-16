import { Router } from "express";
import { createStudent, deleteStudent, editStudent, getStudent, getStudents, getStudentsByCourse, getStudentsByGrade, getStudentsCalificationsByCourse } from "../controllers/students.controllers.js";

const router = Router()

router.get('/students', getStudents)

router.get('/students/:id', getStudent)

router.get('/studentsByGrade/:id_grado', getStudentsByGrade)

router.get('/studentsByCourse/:id_curso', getStudentsByCourse)

router.post('/students', createStudent)

router.post('/studentsCalificationByCourse', getStudentsCalificationsByCourse)

router.put('/students/:id', editStudent)

router.delete('/students/:id', deleteStudent)

export default router
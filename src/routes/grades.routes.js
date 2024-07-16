import { Router } from "express";
import { createGrade, deleteGrade, editGrade, getGrade, getGrades, getTeachersGrades } from "../controllers/grades.controllers.js";

const router = Router()

router.get('/grades', getGrades)

router.get('/grades/:id', getGrade)

router.post('/grades', createGrade)

router.post('/gradesByTeacher', getTeachersGrades)

router.put('/grades/:id', editGrade)

router.delete('/grades/:id', deleteGrade)

export default router
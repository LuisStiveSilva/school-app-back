import { Router } from "express";
import { createTeacher, deleteTeacher, editTeacher, getTeacher, getTeachers, getTeacherSchedule } from "../controllers/teachers.controllers.js";

const router = Router()

router.get('/teachers', getTeachers)

router.get('/teachers/:id', getTeacher)

router.post('/teachers', createTeacher)

router.post('/teachersSchedule', getTeacherSchedule)

router.put('/teachers/:id', editTeacher)

router.delete('/teachers/:id', deleteTeacher)

export default router
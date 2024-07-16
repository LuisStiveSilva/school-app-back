import { Router } from "express";
import { createCourse, deleteCourse, editCourse, getCourse, getCourseByGrade, getCourseByGradeAndTeacher, getCourses, getStudentsCoursesSchedule } from "../controllers/courses.controllers.js";

const router = Router()

router.get('/courses', getCourses)

router.get('/courses/:id', getCourse)

router.get('/coursesByGrade/:id_grado', getCourseByGrade)

router.post('/coursesByGradeAndTeacher', getCourseByGradeAndTeacher)

router.post(`/studentsSchedule`, getStudentsCoursesSchedule)

router.post('/courses', createCourse)

router.put('/courses/:id', editCourse)

router.delete('/courses/:id', deleteCourse)

export default router
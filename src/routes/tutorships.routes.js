import { Router } from "express";
import { createTutorship, deleteTutorship, editTutorship, getTeacherTutorships, getTutorship, getTutorshipByGrade, getTutorshipByTeacherDate, getTutorships } from "../controllers/tutorship.controllers.js";

const router = Router()

router.get('/tutorships', getTutorships)

router.get('/tutorships/:id', getTutorship)

router.get('/tutorshipsByTeacher/:id_profesor', getTeacherTutorships)

router.post(`/tutorshipsByGrade`, getTutorshipByGrade)

router.post(`/tutorshipsByTeacherDate`, getTutorshipByTeacherDate)

router.post('/tutorships', createTutorship)

router.put('/tutorships/:id', editTutorship)

router.delete('/tutorships/:id', deleteTutorship)

export default router
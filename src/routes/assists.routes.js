import { Router } from "express";
import { createAssist, editAssist, getAssistByDate, getAssists, getStudentsAssists } from "../controllers/assists.controller.js";

const router = Router()

router.get('/assists', getAssists)

router.post('/assistssByDate', getAssistByDate)

router.post('/assists', createAssist)

router.put('/assists/:id', editAssist)

router.post('/studentsAssists', getStudentsAssists)

export default router
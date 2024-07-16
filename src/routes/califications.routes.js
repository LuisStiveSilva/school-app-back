import { Router } from "express";
import { createCalification, deleteCalification, editCalification, getCalification, getCalifications, getCalificationsByStudent } from "../controllers/califications.controllers.js";

const router = Router()

router.get('/califications', getCalifications)

router.get('/califications/:id', getCalification)

router.post('/califications', createCalification)

router.post('/calificationsByStudent', getCalificationsByStudent)

router.put('/califications/:id', editCalification)

router.delete('/califications/:id', deleteCalification)

export default router
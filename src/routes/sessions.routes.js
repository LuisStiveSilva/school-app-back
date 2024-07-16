import { Router } from "express";
import { createSession, deleteSession, editSession, getSession, getSessionByCourse, getSessions } from "../controllers/sessions.controllers.js";

const router = Router()

router.get('/sessions', getSessions)

router.get('/sessions/:id', getSession)

router.get('/sessionsByCourse/:id_curso', getSessionByCourse)

router.post('/sessions', createSession)

router.put('/sessions/:id', editSession)

router.delete('/sessions/:id', deleteSession)

export default router
import { Router } from "express";
import { createInscription, deleteInscription, editInscription, getInscription, getInscriptions } from "../controllers/inscriptions.controllers.js";

const router = Router()

router.get('/inscriptions', getInscriptions)

router.get('/inscriptions/:id', getInscription)

router.post('/inscriptions', createInscription)

router.put('/inscriptions/:id', editInscription)

router.delete('/inscriptions/:id', deleteInscription)

export default router
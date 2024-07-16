import express from "express"
import studentsRoutes from "./routes/students.routes.js"
import teachersRoutes from "./routes/teachers.routes.js"
import inscriptionsRoutes from "./routes/inscriptions.routes.js"
import calificationsRoutes from "./routes/califications.routes.js"
import coursesRoutes from "./routes/courses.routes.js"
import tutorshipsRoutes from "./routes/tutorships.routes.js"
import gradesRoutes from "./routes/grades.routes.js"
import sessionsRoutes from "./routes/sessions.routes.js"
import loginRoutes from "./routes/login.routes.js"
import assistsRoutes from "./routes/assists.routes.js"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

app.use(studentsRoutes)
app.use(teachersRoutes)
app.use(inscriptionsRoutes)
app.use(calificationsRoutes)
app.use(coursesRoutes)
app.use(tutorshipsRoutes)
app.use(gradesRoutes)
app.use(sessionsRoutes)
app.use(assistsRoutes)
app.use(loginRoutes)

export default app
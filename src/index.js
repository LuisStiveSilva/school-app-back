import app from "./app.js"
import { getConnection } from "./database/connection.js"

getConnection()
app.listen(process.env.PORT || 3000)
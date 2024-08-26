import express from "express"
import serverConfig from './config/serverConfig.js'
import apiRouter from './routes/index.js'
import dbconnect from "./config/dbConfig.js";
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();
app.use(
  cors({
    origin:
  "https://ecommerce-frontend-mn2a.vercel.app",

    credentials: true,
  })
);
app.use(cookieParser())

app.use(express.json());
app.use("/api",apiRouter)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(serverConfig.Port, () => {
  console.log(`App listening on port ${serverConfig.Port}`)
  dbconnect();
  console.log("Database is connected")
})
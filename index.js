import express from "express"
import serverConfig from './src/config/serverConfig.js'
import apiRouter from './src/routes/index.js'
import dbconnect from "./src/config/dbConfig.js";
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();
app.use(
  cors({
    origin:'*',
  // "https://ecommerce-frontend-sigma-seven.vercel.app",
  // "http://localhost:5173",

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
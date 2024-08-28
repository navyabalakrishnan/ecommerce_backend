import express from "express"
import serverConfig from './src/config/serverConfig.js'
import apiRouter from './src/routes/index.js'
import dbconnect from "./src/config/dbConfig.js";
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();
// app.use(
//   cors({
//     origin:'*',
//   // "https://ecommerce-frontend-sigma-seven.vercel.app",
//   // "http://localhost:5173",
 
//     credentials: true,
//   })
// );

const allowedOrigins = [
 
  "https://livec-five.vercel.app"
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, like mobile apps or curl requests
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-CSRF-Token",
      "Access-Control-Allow-Origin"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
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
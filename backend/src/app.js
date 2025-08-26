import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import { env } from "./config/env.js"
import  { routerV1 } from "./routes/v1/index.js"
import { errorMiddleware } from "./middlewares/error.middleware.js"


const app = express()

app.use(helmet())
app.use(cors({
    origin: env.FRONTED_URL,
    credentials: true,
}))
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan( env.NODE_ENV === "production" ? "combined" : "dev"))

app.use(rateLimit({
    windowMs: 15*60*1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too Many requests, please try again later "},
}))

app.get("/", ( req, res ) => {
    res.send("BhramanGuru Backend is running")
})
app.get("/health", (req, res) => {
    res.json({ status: "OK" })
})


app.use("/api/v1", routerV1)

app.use(errorMiddleware)

export {app}

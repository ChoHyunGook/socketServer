import express from "express";
import cors from 'cors'

const corsOptions = {
    origin : process.env.ORIGIN,
    optionsSuccessStatus : 200
}

const app = express()

app.use(cors({
    origin:true,
    credentials: true
}))

app.use(function(_req, res, next) {
    res.header(
        "Access-Control-Allow-Tabletheaders",
        "x-access-token, Origin, Content-Type, Accept",
        "Access-Control-Allow-Origin", "*"
    );
    next();
});

export default app
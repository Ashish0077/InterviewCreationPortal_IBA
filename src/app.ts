import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import connectDB from "./database/db";

connectDB();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.json({
        success: true,
        msg: "Server is up and running. Voila!!"
    });
});

export default app;
import express, { NextFunction, Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.json({
        success: true,
        msg: "Server is up and running. Voila!!"
    });
});

export default app;
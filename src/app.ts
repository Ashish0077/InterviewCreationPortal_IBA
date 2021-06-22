import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import connectDB from "./database/db";
import routerV1 from "./routes/v1/router";
import { ApiError, InternalError } from "./core/ApiError";
import { environment } from "./config";
import { SuccessResponse } from "./core/ApiResponse";
import cors from "cors";

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

app.use("/v1", routerV1);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
	new SuccessResponse("Server is up and running. Voila!!", {}).send(res);
});

// Middleware Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	// redirecting the error to ApiError Class
	if (err instanceof ApiError) {
		ApiError.handle(err, res);
	} else {
		if (environment == "dev") {
			return res.status(500).send(err.message);
		}
		ApiError.handle(new InternalError(), res);
	}
});

export default app;

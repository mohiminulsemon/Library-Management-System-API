import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import router from "./app/routes";

const app: Application = express();
app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Welcome to Library Management System API..."
    })
});

app.use('/api', router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "API Route Not found",
        error: {
            path: req.originalUrl,
            message: "Your API request path is not correct"
        }
    })
});

export default app;


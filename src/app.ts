import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";

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

export default app;


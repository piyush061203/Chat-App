import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { config } from 'dotenv';
import cors from 'cors';
import databaseConnect from './database/database.js';
import userRouter from './routes/user.routes.js';


config({ path: './config/config.env' });

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: 'temp',
}));

app.use('/api/v1/user', userRouter);




databaseConnect();

export default app;

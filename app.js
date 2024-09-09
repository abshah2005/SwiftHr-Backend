import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import userRoutes from "./Routes/Users.route.js"
import applicationRoutes from "./Routes/Applications.route.js"
import positionroutes from "./Routes/Positions.route.js"

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(cookieParser());


app.use('/api/positions', positionroutes);
app.use('/api/applications', applicationRoutes);
// app.use('/api/users', userRoutes);




export { app };
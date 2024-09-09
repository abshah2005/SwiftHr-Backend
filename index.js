// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import positionRoutes from './routes/positionRoutes.js';
// import applicationRoutes from './routes/applicationRoutes.js';
// import userRoutes from './routes/userRoutes.js';

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

// app.use('/api/positions', positionRoutes);
// app.use('/api/applications', applicationRoutes);
// app.use('/api/users', userRoutes);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import dotenv from "dotenv"
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({path:"./env"});

connectDB().then(
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server running on port : ${process.env.PORT}`)
    })
).catch((err)=>{
    console.log("MongoDB connection failed !!!",err)
})
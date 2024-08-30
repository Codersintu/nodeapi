const express=require('express');
const app=express();
const mongoose =require('mongoose')
const dotenv =require('dotenv')
const helmet =require('helmet')
const userRoute=require("./router/user")
const authRoute=require("./router/auth")
const postRoute=require("./router/post")
const morgan =require('morgan')
dotenv.config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            // No deprecated options needed
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}
connectDB();
console.log('MongoDB URI:', process.env.MONGO_URL);

app.use(express.json());
app.use(helmet());
app.use(morgan("common"))

app.get("/",(req,res)=>{
    res.send('welcome to home page')
})
app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/post",postRoute)


const PORT=8800
app.listen(PORT,()=>{
    console.log(`Backend server is running http://localhost:${PORT}`)
})

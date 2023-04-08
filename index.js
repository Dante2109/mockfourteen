const express=require("express");
const cors=require("cors");
const { connection } = require("./Configs/db");
const { userRouter } = require("./Routes/userRoutes");
require("dotenv").config()
const server=express();

server.use(cors());
server.use(express.json());
server.use("/users",userRouter)

server.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Database has been connected");
    } catch (error) {
        console.log(error)
    }
    console.log("Server has been connected")
})

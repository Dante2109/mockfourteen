const express=require("express");
const cors=require("cors");
const { connection } = require("./Configs/db");
require("dotenv").config()
const server=express();

server.use(cors());
server.use(express.json());


server.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Database has been connected");
    } catch (error) {
        console.log(error)
    }
    console.log("Server has been connected")
})

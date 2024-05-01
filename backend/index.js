import express from "express"
import dbconnect from './dbs.js';
import {addUserInfo, getUserInfo} from "./controller/UserController.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import getProfiledata from "./controller/UserProfileController.js";
const app=express();
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}));
app.use(cookieParser())
app.use(express.json())
app.get("/test",(req,res)=>{
    res.send("hello");
})
dbconnect();
app.post("/register",addUserInfo);
app.get("/profile",getProfiledata);
app.post("/login",getUserInfo);
app.listen(5000,()=>{
    console.log("server is running")
});
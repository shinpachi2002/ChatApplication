import 'dotenv/config.js';
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';

const jwtsecret = process.env.JWT_SECRET;

async function getProfiledata(req,res){ 
    try { 
         const{token}= await req.cookies;
          if(token){
            jwt.verify(token,jwtsecret,{},(err,userData)=>{
                if(err) throw err
                res.json(userData);
            })
          }
          else{
            res.status(201).json("no token");
          }
    } catch (error) {
         console.log(error);
    }
}

export default  getProfiledata;
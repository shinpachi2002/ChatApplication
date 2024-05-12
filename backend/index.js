import express, { json } from "express";
import fs from 'fs';
import dbconnect from "./dbs.js";
import { addUserInfo, getUserInfo } from "./controller/UserController.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import getProfiledata from "./controller/UserProfileController.js";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import MessageModel from "./models/Message.js";
import UserModel from "./models/User.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const jwtsecret = process.env.JWT_SECRET;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", 
  }) 
);
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.get("/test", (req, res) => {
  res.send("hello");
});

dbconnect();

app.post("/register", addUserInfo);

app.get("/profile", getProfiledata);

app.post("/login", getUserInfo);


app.get("/people",async(req,res)=>{
  try {
    const users=await UserModel.find({},{"_id":1,username:1});
    res.json(users);
  } catch (error) {
    console.log(error);
  }
})



app.get("/messages/:userId",async(req,res)=>{
  const {userId}=req.params;
 try {
  const {token}= await req.cookies;
  jwt.verify(token,jwtsecret,{},async(err,userData)=>{
    if(err)throw err;
    const OurUserId=userData.userId;
    const messages=await MessageModel.find({ 
      sender:{$in:[userId,OurUserId]},
      recipient:{$in:[userId,OurUserId]}
    }).sort({createdAt:1});
    res.json(messages);
  })
 } catch (error) {
  console.log("no token");
 }
 
})

app.post("/logout",(req,res)=>{
  res.clearCookie("token").json("ok");
})
// Create HTTP server instance
const server = app.listen(5000, () => {
  console.log("Express server is running on port 5000");
});

// Create WebSocket server using the same HTTP server instance
const wss = new WebSocketServer({ server });

// WebSocket connection handler
wss.on('connection', (connection, req) => {

  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId:c.userId,username:c.username})),
      }));
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log('dead');
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });

  // read username and id form the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtsecret, {}, (err, userData) => {
          if (err) throw err;
          const {userId, username} = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const {recipient, text, file} = messageData;
    let filename = null;
    if (file) {
      console.log('size', file.data.length);
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      filename = Date.now() + '.'+ext;
      const path = join(__dirname + '/uploads/' + filename);
      const bufferData = new Buffer(file.data.split(',')[1], 'base64');
      fs.writeFile(path, bufferData, () => {
        console.log('file saved:'+path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await MessageModel.create({
        sender:connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      console.log('created message');
      [...wss.clients]
        .filter(c => c.userId === recipient)
        .forEach(c => c.send(JSON.stringify({
          text,
          sender:connection.userId,
          recipient, 
          file: file ? filename : null,
          _id:messageDoc._id,
        })));
    }
  });

  // notify everyone about online people (when someone connects)
  notifyAboutOnlinePeople();
});
import express, { json } from "express";
import dbconnect from "./dbs.js";
import { addUserInfo, getUserInfo } from "./controller/UserController.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import getProfiledata from "./controller/UserProfileController.js";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import MessageModel from "./models/Message.js";
const jwtsecret = process.env.JWT_SECRET;
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("hello");
});

dbconnect();

app.post("/register", addUserInfo);

app.get("/profile", getProfiledata);

app.post("/login", getUserInfo);


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
    console.log(messages);
    res.json(messages);
  })
 } catch (error) {
  console.log("no token");
 }
 
})


// Create HTTP server instance
const server = app.listen(5000, () => {
  console.log("Express server is running on port 5000");
});

// Create WebSocket server using the same HTTP server instance
const wss = new WebSocketServer({ server });

// WebSocket connection handler
wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokencookiestring = cookies.split(";");
    const tokencookiestring2 = tokencookiestring.find((str) =>
      str.trim().startsWith("token=")
    );
    if (tokencookiestring2) {
      const token = tokencookiestring2.split("=")[1];
      if (token) {
        jwt.verify(token, jwtsecret, {}, (err, userdata) => {
          if (err) throw err;
          const { userId, username } = userdata;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }
  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;
    if (recipient && text) {
      try {
        const messagedoc = await MessageModel.create({
          sender: connection.userId,
          recipient,
          text,
        });
        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) =>
            c.send(JSON.stringify({ text, sender: connection.userId,id:messagedoc._id,recipient:recipient }))
          );
      } catch (error) {
        console.log(error);
      }
    }
  });
  //this function collects the data from the cookie and stores the username and userid in it and send to the other clients connected to the web socket
  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
        })),
      })
    );
  });
});

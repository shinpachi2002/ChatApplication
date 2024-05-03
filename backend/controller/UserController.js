import 'dotenv/config.js';
import UserModel from '../models/User.js';
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import bcrypt from "bcrypt";
const jwtsecret = process.env.JWT_SECRET
const salt = bcrypt.genSaltSync(10);
async function addUserInfo(req, res) {
    const { username, password } = req.body;
    const hashedpassword = bcrypt.hashSync(password, salt);
    try {
        const createdUser = await UserModel.create({
            username: username,
            password: hashedpassword
        });
        jwt.sign({ userId: createdUser._id, username }, jwtsecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).status(201).json({
                id: createdUser._id,
            });
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({ "message": error })
    }
}

async function getUserInfo(req, res) {
    const { username, password } = req.body;
    try {
        const founduser = await UserModel.findOne({ username });
        if (founduser) {
            const passok = bcrypt.compareSync(password, founduser.password);
            if (passok) { 
                jwt.sign({ userId: founduser._id, username: founduser.username }, jwtsecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).status(201).json({
                        id: founduser._id,
                    });
                });
            } else {
                res.status(422).json({ message: "Password Not ok" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    } 
}


export { addUserInfo,getUserInfo };

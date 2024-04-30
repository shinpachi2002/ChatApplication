import 'dotenv/config.js';
import UserModel from '../models/User.js';
import jwt from "jsonwebtoken";

const jwtsecret = process.env.JWT_SECRET
async function addUserInfo(req, res) {
    const { username, password } = req.body;
    try {
        const createdUser = await UserModel.create({ username, password });
        jwt.sign({ userId: createdUser._id }, jwtsecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).status(201).send(createdUser);
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({ "message": error })
    }
}

export { addUserInfo };

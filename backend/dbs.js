import mongoose from "mongoose";
import 'dotenv/config' 
async function dbconnect(){
    const DBURL=process.env.MONGO_URL;
    const DBNAME="chatapplication "
    try {
        await mongoose.connect(DBURL+"/"+DBNAME)
    } catch (error) {
        console.log(error);
    }
}

export default dbconnect;
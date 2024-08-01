import mongoose from "mongoose";
import serverConfig from "./serverConfig.js";
async function dbconnect() {
try{
    await mongoose.connect(serverConfig.db);
}catch(error){

    console.log(error);

}
}
export default dbconnect;
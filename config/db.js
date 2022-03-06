const mongoose = require("mongoose");
const config = require("config");

const connectDB = async() =>{
    try{
        await mongoose.connect(config.get("mongoURI"),{
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 1000});
        console.log("database connected")
    }catch(err){
        console.log("mongoose error"+ err)
        process.exit(1)
    }
}
module.exports = connectDB;
const mongoose = require('mongoose')
const dbconnect = async()=>{
    try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to DB");  
    } catch (error) {
      console.log(error);  
    }
}

module.exports = dbconnect
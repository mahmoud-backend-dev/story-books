const mongoose = require('mongoose');
const MONGO_URL = "mongodb+srv://mh15721812:15721812@cluster0.owthrxo.mongodb.net/storybooks?retryWrites=true&w=majority"
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URL); //process.env.MONGO_URL
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB
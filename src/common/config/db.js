import mongoose, { mongo } from "mongoose";
import 'dotenv/config';

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`Address Of the DB: ${conn.connection.host}`);
        console.log(`Name of the DB: ${conn.connection.name}`);
        console.log(`Port no.: ${conn.connection.port}`);
        console.log(`Connection Status: ${conn.connection.readyState}`);
    }
    catch (err) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;
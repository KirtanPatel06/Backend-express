import app from "./src/app.js";
import 'dotenv/config';
import connectDB from "./src/common/config/db.js";

const port = process.env.PORT || 8080;

const start = async() => {
    // TODO:- connect DB
    await connectDB();

    app.listen(port, async() => {
        console.log(`Server Started on PORT: ${port}`);
    });
}

start().catch((err)=> {
    console.log("Error: ", err);
    process.exit(1);
});
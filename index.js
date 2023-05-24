import express from "express";
import db from "./config/Database.js";
import Users from "./models/userModels.js";


const app =express();
const port = 5000;

try {
    await db.authenticate();
    console.log('Database Connected ..');
    await Users.sync();
} catch (err) {
    console.error(err);
}

app.listen(port,()=>{
    console.log(`Server running at port ${port}`)
});
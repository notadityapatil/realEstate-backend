import express from "express";
import postRoute from "./routers/posts.route.js";
import authRoute from "./routers/auth.route.js";


const app = express();

app.use(express.json());

console.log("Hello World!");

app.use("/api/posts", postRoute);

app.use("/api/auth", authRoute);


app.listen(8800, () => {
    console.log("Backend server is running!");
});
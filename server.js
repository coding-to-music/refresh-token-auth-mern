import express from "express";
import { config } from "dotenv";
import dbConnect from "./dbConnect.js";
import authRoutes from "./routes/auth.js";
import refreshTokenRoutes from "./routes/refreshToken.js";
import userRoutes from "./routes/users.js";

const app = express();

config();
dbConnect();

app.use(express.json());

// app.set("views", __dirname + "/views");

// app.set("views", "/views");
app.get('/', function(req, res){
    res.send("Hello world!");
 });

app.use("/api", authRoutes);
app.use("/api/refreshToken", refreshTokenRoutes);
app.use("/api/users", userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Listening on port ${port}... or http://localhost:${port}`)
);

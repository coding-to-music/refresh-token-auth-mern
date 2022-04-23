import "dotenv/config";
import mongoose from "mongoose";
import { config } from "dotenv";

// const DB = process.env.MONGODB_URI;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/refresh-token-auth-mern";

const dbConnect = () => {
  const connectionParams = { useNewUrlParser: true };
  mongoose
    .connect(MONGODB_URI, connectionParams)
    .then((x) => {
      console.log(
        `Connected to Mongo! Database name: "${x.connections[0].name}"`
      );
    })
    .catch((err) => {
      console.error("Error connecting to mongo: ", err);
    });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongodb connection disconnected");
  });
};

export default dbConnect;

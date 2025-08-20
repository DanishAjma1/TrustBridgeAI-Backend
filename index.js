import express from "express";
import cors from "cors";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRouter from "./app/middleware/authMiddleware.js";

const app = express();
const server = createServer(app);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRouter);
server.listen(5000, () => {
  console.log("server is listening on port 5000");
});

import express from "express";
import cors from "cors";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRouter from "./app/middleware/authMiddleware.js";
import userRouter from "./app/routes/userRouter.js";
import enterpreneurRouter from "./app/routes/entrepreneurRouter.js";
import investorRouter from "./app/routes/investorRouter.js";
import messageRouter from "./app/routes/messageRouter.js";
import conversationRouter from "./app/routes/conversationRouter.js";
import { SocketListeners } from "./app/utils/socketListeners.js";
import collaborationRouter from "./app/routes/collaborationRouter.js";
import agoraRouter from "./app/config/agoraRoute.js";
import { auth } from 'express-openid-connect';
const app = express();
const server = createServer(app);

SocketListeners(server);


app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
const config = {
  authRequired: false, // only protect certain routes
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET, // random long string
  baseURL: "http://localhost:5000", // backend base URL
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
};

app.use(auth(config));

// Example public route
app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce API");
});

// Example protected route
app.get("/profile", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user);
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.use("/uploads", express.static("uploads"));
app.use("/auth", authRouter);
app.use("/requests", collaborationRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);
app.use("/user", userRouter);
app.use("/entrepreneur", enterpreneurRouter);
app.use("/investor", investorRouter);
app.use("/agora", agoraRouter);
server.listen(5000, () => {
  console.log("server is listening on port 5000");
});

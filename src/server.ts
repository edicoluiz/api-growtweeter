import cors from "cors";
import "dotenv/config";
import express from "express";
import { AuthRoutes } from "./routes/auth.routes";
import { FeedRoutes } from "./routes/feed.routes";
import { FollowersRoutes } from "./routes/followers.routes";
import { LikeRoutes } from "./routes/like.routes";
import { ReplyRoutes } from "./routes/reply.routes";
import { TweetRoutes } from "./routes/tweet.routes";
import { UserRoutes } from "./routes/users.routes";
import swaggerUI from "swagger-ui-express";
import swaggerDoc from "./docs/swagger.json";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://growtweeter-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Hello Growdever!",
    ok: true,
  });
});

app.use("/docs", swaggerUI.serve);
app.get("/docs", swaggerUI.setup(swaggerDoc));

app.use("/user", UserRoutes.execute());
app.use("/auth", AuthRoutes.execute());
app.use("/tweet", TweetRoutes.execute());
app.use("/like", LikeRoutes.execute());
app.use("/follower", FollowersRoutes.execute());
app.use("/reply", ReplyRoutes.execute());
app.use("/feed", FeedRoutes.execute());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
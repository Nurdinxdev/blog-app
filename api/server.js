import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import passport from "./config/passport.js";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/database.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const URL =
  process.env.NODE_ENV === "production"
    ? process.env.URL
    : "http://localhost:5173";

const SequelizeSessionStore = SequelizeStore(session.Store);
const store = new SequelizeSessionStore({
  db: db,
});
const corsOptions = {
  origin: URL,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "OPTIONS", "PATCH", "PUT"],
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "none",
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import authRoutes from "./routes/auth.router.js";

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.get("/*", (req, res) => {
  res.status(404).send("Not Found");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// store.sync();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import passport from "./lib/passport";
import router from "./routes";
import authRouter from "./routes/auth";
import aiRouter from "./routes/ai";
import paymentsRouter from "./routes/payments";
import notificationsRouter from "./routes/notifications";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "internship_engine_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/api", router);
app.use("/api/ai", aiRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/notifications", notificationsRouter);

// Redirect root to frontend
app.get("/", (req, res) => {
  res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Backend Global Error:", err);
  res.status(500).json({ 
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

export default app;

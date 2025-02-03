import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import Database from "better-sqlite3";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), UPLOAD_DIR)));

// Initialize SQLite database
const db = new Database('database.sqlite');

// Create a sample table if not exists
db.prepare(`CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method TEXT,
  path TEXT,
  status INTEGER,
  duration INTEGER,
  response TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      const response = capturedJsonResponse ? JSON.stringify(capturedJsonResponse) : null;

      // Insert log into SQLite
      db.prepare(`INSERT INTO logs (method, path, status, duration, response) VALUES (?, ?, ?, ?, ?)`)
        .run(req.method, path, res.statusCode, duration, response);

      log(logLine.length > 80 ? logLine.slice(0, 79) + "…" : logLine);
    }
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();


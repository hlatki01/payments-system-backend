import express from "express";
import "express-async-errors";
import cors from "cors";
import path from "path";

import { router } from "./routes";
import logRequest from "./middlewares/loggingMiddleware";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Use the logging middleware
app.use(logRequest);

// Routes
app.use(router);

// Static files
app.use("/files", express.static(path.resolve(__dirname, "..", "storage")));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

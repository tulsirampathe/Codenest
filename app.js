import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./config.js";
import adminRoutes from "./routes/adminRoutes.js";
import ChallengeRoutes from "./routes/ChallengeRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import testCaseRoutes from "./routes/testCaseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";

import path from "path";
import { fileURLToPath } from "url";

// Resolving dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize dotenv to load environment variables
config();

// Connect to MongoDB
connectDB();

// Initialize the app
const app = express();

// Define the port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(express.json());

// Morgan for logging (only in development mode)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.CLIENT_URL, // Ensure CLIENT_URL is set in .env
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // For cookies and credentials
  })
);

// Serve the client application
app.use(express.static(path.join(__dirname, "/client/dist")));

// API Routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/challenge", ChallengeRoutes);
app.use("/question", questionRoutes);
app.use("/testCase", testCaseRoutes);
app.use("/submission", submissionRoutes);

// Catch-All Route for Client Side Rendering
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

// Root Route
app.get("/", (req, res) => {
  res.send("Hello from coding platform. Happy Coding 💖");
});

// Error Handling Middleware
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;

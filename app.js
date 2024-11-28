import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./config.js";
import adminRoutes from "./routes/adminRoutes.js";
import ChallengeRoutes from "./routes/challengeRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import testCaseRoutes from "./routes/testCaseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";

import path from "path";
import { fileURLToPath } from "url";

// Resolving __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize dotenv to load environment variables
config();

// Validate environment variables
if (!process.env.MONGO_URI || !process.env.CLIENT_URL) {
    console.error("Error: Missing essential environment variables!");
    process.exit(1);
}

// Connect to MongoDB
connectDB();

// Initialize the app
const app = express();

// Define the port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(express.json());

// Logging with Morgan
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    console.log("Morgan disabled in production.");
}

// Configure CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // For cookies and credentials
    })
);

// Serve the client application
const clientPath = path.join(__dirname, "/client/dist");
app.use(express.static(clientPath));

// API Routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/challenge", ChallengeRoutes);
app.use("/question", questionRoutes);
app.use("/testCase", testCaseRoutes);
app.use("/submission", submissionRoutes);

// Catch-All Route for Client Side Rendering
app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
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

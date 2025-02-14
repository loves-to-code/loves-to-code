import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import root from "./routes/root";

const app = express();

// Middleware
app.use(morgan("dev")); // Logging
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS

// Routes - with version
app.use("/", root);

// 404 Handler
app.use((req, res) => {
    console.log(res)
    res.status(404).json({ message: "Not Found" });
});

export default app;
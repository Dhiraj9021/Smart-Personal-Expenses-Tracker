const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/IncomeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const aichat = require("./routes/ai-chat");
const statsRouter = require("./routes/statsRouter");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// --- CORS ---
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://expensetracko.vercel.app"
  ],
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"]
}));

// --- Body parser ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Connect MongoDB ---
connectDB();

// --- Session ---
app.use(session({
  secret: process.env.SESSION_SECRET || "expense_tracker_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: "lax",
    secure: false
  }
}));

// --- View engine ---
app.set("view engine", "ejs");

// --- Routes ---
app.get("/api", (req,res) => res.json({ message: "Backend connected 🚀" }));
app.get("/", (req,res) => res.send("🚀 Smart Personal Expenses Tracker API"));

// API routes
app.use("/auth", authRoutes);
app.use("/aichat", aichat);
app.use("/expense", expenseRoutes);
app.use("/income", incomeRoutes);
app.use("/stats", statsRouter);
app.use("/", dashboardRoutes);

// --- Error handler (after routes) ---
app.use(errorHandler);

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require('cors')
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/IncomeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const aichat = require("./routes/ai-chat");
const statsRouter = require("./routes/statsRouter");
const errorHandler = require("./middleware/errorHandler");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://smart-personal-expenses-tracker.vercel.app"],
  
  credentials: true,               // allow cookies/sessions
}));
// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connect
connectDB();

// Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "expense_tracker_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
      sameSite: "lax",              //  allow frontend to send cookie
    secure: false                  // allow over http
  })
);

// View engine
app.set("view engine", "ejs");

// Routes
// Test route for React connection
app.get("/api", (req, res) => {
  res.json({ message: "Backend connected successfully 🚀" });
});

app.get("/", (req, res) => {
  res.send("🚀 Smart Personal Expenses Tracker API is running");
});
app.use(errorHandler);

app.use("/auth", authRoutes); 
app.use("/", dashboardRoutes);
app.use("/aichat",aichat);
app.use("/expense", expenseRoutes);
app.use("/income", incomeRoutes);
app.use("/stats", statsRouter);

// Server
app.listen(5000, () =>
  console.log("Server started on port 5000")
);

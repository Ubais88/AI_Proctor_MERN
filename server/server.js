const express = require("express");
require('dotenv').config()
const { errorHandler, notFound } =  require("./middleware/errorMiddleware.js");
const {connectDB} = require("./config/db.js");
const cookieParser = require("cookie-parser");
const examRoutes = require("./routes/examRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

// dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// to parse req boy
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/users", examRoutes);

// we we are deploying this in production
// make frontend build then
// if (process.env.NODE_ENV === "production") {
//   const __dirname = path.resolve();
//   // we making front build folder static to serve from this app
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   // if we get an routes that are not define by us we show then index html file
//   // every enpoint that is not api/users go to this index file
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("<h1>server is running </h1>");
//   });
// }

app.get("/", (req, res) => {
  res.send("<h1>server is running </h1>");
});
connectDB();

// Custom Middlewares
app.use(notFound);
app.use(errorHandler);

// Server
app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});

// Todos:
// -**POST /api/users**- Register a users
// -**POST /api/users/auth**- Authenticate a user and get token
// -**POST /api/users/logout**- logou user and clear cookie
// -**GET /api/users/profile**- Get user Profile
// -**PUT /api/users/profile**- Update user Profile

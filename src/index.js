import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import MongoDBStoreFactory from 'connect-mongodb-session';
const MongoDBStore = MongoDBStoreFactory(session);
import helmet from "helmet";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import path from "path";
import passport from 'passport';
import session from 'express-session';
import { fileURLToPath } from "url";
import authRoutes from "./app/routes/auth.js";
import userRoutes from "./app/routes/users.js";
import { signup, login, forgotPassword, resetPassword } from "./app/controllers/auth.js";
import { verifyToken } from "./app/middleware/auth.js";
// enable connection
import { connect } from "./app/config/database.js";
connect();
/*Configurations*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// Set up session middleware
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "mySessions"
});
store.on("error", (error)=>{
    console.log(error);
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
// Initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());
// Set up Passport serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
// Set up Google OAuth routes
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get(
  '/auth/google/books',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/books');
  }
);
/*File Storage*/
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets");
    },
    filename: (req, rile, cb)=>{
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });
//reset password page
app.get("/auth/reset-password", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Reset Password</title>
      </head>
      <body>
        <h1>Reset Password</h1>
        <p>Enter your email address to reset your password</p>
        <form action="/auth/reset-password" method="POST">
          <input type="email" name="email" required />
          <button type="submit">Reset Password</button>
        </form>
      </body>
    </html>
  `);
});
/* Routes With Files*/ 
app.post("/auth/signup", signup);
// login route
app.post("/auth/login", login);
// forgot password route
app.post("/auth/reset-password/:token", resetPassword);
app.post("/auth/forgot-password", forgotPassword);
/* Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
/* Mongoose Setup */
const PORT = process.env.PORT || 9000;
mongoose.set('strictQuery', true);
// starting the server
app.listen(PORT, () => {
    console.log(`SERVER RUNNING 0N ${PORT} `);
});

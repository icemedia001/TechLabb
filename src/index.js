import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./app/routes/auth.js";
import userRoutes from "./app/routes/users.js";
import { signup, login, forgotPassword } from "./app/controllers/auth.js";
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
/* Routes With Files*/ 
app.post("/auth/signup", signup);
// forgot password route
app.post("/auth/reset-password", forgotPassword);
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
// login route
app.post("/auth/login", login);
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

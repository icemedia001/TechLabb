import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";
/* Register User */
// forgotPassword controller function
export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate a password reset token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Send password reset email to user
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.SMTP_SENDER_EMAIL,
        to: email,
        subject: "Password Reset Request",
        html: `
          <p>Hello,</p>
          <p>You recently requested to reset your password. Please click on the link below to reset your password:</p>
          <p><a href="${process.env.CLIENT_URL}/reset-password/${token}">Reset Password</a></p>
          <p>If you did not make this request, you can ignore this email.</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
      return res.json({ message: "Password reset email sent" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
export const signup = async (req, res)=>{
    try {
        const {
            username,
            email,
            password
        } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
        username,
            email,
            password: passwordHash
});
const savedUser = await newUser.save();
res.status(201).json(savedUser);
} catch (err){
    res.status(500).json({ error: err.message });
}
};
/*Logging In*/
export const login = async (req, res)=>{
    try{
        const { email, password } = req.body;
        const user = await user.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist." });
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err){
        res.status(500).json({ error: err.message });
    }
};
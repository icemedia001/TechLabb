import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import crypto from "crypto";
import Joi from "joi";
dotenv.config();
/* Register User */
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
        const user = await User.findOne({ email: email });
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
//google-oauth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/google/books',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          // If user doesn't exist, create a new user
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: '', // Since the user is logging in with Google, there's no need for a password
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
//FORGOT PASSWORD
export const forgotPassword = async (req, res) => {

  // company email
  const companyEmail = process.env.SMTP_USERNAME;

  // company password 
  const companyPassword = process.env.SMTP_PASSWORD;

  try {

    // Joi validator
    const userSchema = Joi.object({
      email: Joi.string().email().required(),
    })

    // check error
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false,
    })

    // return error from fields
    if (error) return res.status(400).json(error.details[0].message);

    //find user
    const user = await User.findOne({ email: req.body.email });

    !user && res.status(400).json("Invalid email address");

    //generate a unique token
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();


    const resetUrl = process.env.CLIENT_URL;

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PASSWORD,
      auth: {
        user: companyEmail,
        pass: companyPassword
      }
    });
  
    let mailOptions = {
      from: companyEmail,
      to: user.email,
      subject: 'Password Reset Request for Your Techlabb Account',
      text: `Dear ${user.name},
    
    We have received a request to reset your password for your Techlabb account. If you did not request this, please ignore this email.
    
    To reset your password, please follow the steps below:
    
    1. Click on the following link: <a href="http://${resetUrl}/reset-password/${token}">
    2. Enter your email address associated with your Techlabb account.
    3. Check your email for a verification code and enter it on the password reset page.
    4. Enter a new password and confirm it.
    5. Click the "Submit" button.
    
    If you have any trouble resetting your password or have any questions, please contact our support team at <a href="mailto:teniopemipo@gmail.com">support@techlabb.com</a>.
.
    
    Best regards,
    The Techlabb Team`
    };
    

    await transporter.sendMail(mailOptions);

    res.status(500).json('An email has been sent to the provided email with further instructions.');

  } catch (err) {
    res.status(500).json(err);
  }
}

// RESET PASSWORD
export const resetPassword = async (req, res) => {

  try {
    const { token } = req.params;

    const userSchema = Joi.object({
      password: Joi.string().min(6).max(30).required(),
      confirmpassword: Joi.string().valid(Joi.ref('password')).required(),
    })


    // check error
    const { error } = userSchema.validate(req.body, {
      abortEarly: false,
    })

    // return error from fields
    if (error) return res.status(400).json(error.details[0].message);

    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });


    if (!user) {
      return res.status(400).json('Invalid or expired token. Please try again.');
    }

    // Update the user's password and clear the reset token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json('Your password has been reset.');
   
  } catch (err) {
    res.status(500).json(err);
  }
}
import mongoose from "mongoose";
// const passportLocalMongoose = require("passport-local-mongoose");
// const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  googleId: String,
  username: {
    type: String,
    required: true,
    min: 5,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
    },
  password: {
    type: String,
    required: true,
    min: 5,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.generatePasswordResetToken = ()=>{
  const token = crypto.randomBytes(20).toString("he")
}
// userSchema.plugin(findOrCreate);

// module.exports = mongoose.model("User", userSchema);
const User = mongoose.model("User", userSchema);
export default User;
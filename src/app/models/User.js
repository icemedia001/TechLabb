import mongoose from "mongoose";

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
},

  { timestamps: true });

//userSchema.methods.generatePasswordResetToken = ()=>{
//  const token = crypto.randomBytes(20).toString("he")
//}
const User = mongoose.model("User", userSchema);
export default User;
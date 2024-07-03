import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    sparse: true,
  },
  displayName: String,
  firstName: String,
  lastName: String,
  image: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String, // Added password field for app auth users
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  theme: {
    type: Number,
    default: 0,
  },
});
// Ensure sparse index
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

// Password hash middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

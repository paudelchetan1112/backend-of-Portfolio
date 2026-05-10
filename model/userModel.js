import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,   // must provide name
  },
  email: {
    type: String,
    required: true,
    unique: true,     // no duplicate emails
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true   // createdAt & updatedAt
});

// create model
const User = mongoose.model("User", userSchema);

export default User;
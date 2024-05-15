const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  chathistory: { type: Array, default: [] },
});

const User = mongoose.model("User", SignupSchema);

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/bugpt', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB...');
  } catch (err) {
    console.error('Could not connect to MongoDB:', err);
  }
}

connectDB();

module.exports = User;

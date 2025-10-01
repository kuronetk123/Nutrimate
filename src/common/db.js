import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect("mongodb+srv://phongltt0203:bonnehihi123@ecchan.za1shup.mongodb.net/?retryWrites=true&w=majority&appName=ecchan", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
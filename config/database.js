import mongoose from "mongoose";
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to DB ${con.connection.host}`);
  } catch (err) {
    console.log(`Error when connect DB ${err.message}`);
  }
};

export default connectDB;

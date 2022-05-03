import mongoose from "mongoose";

const connectDB = async () => {
  try {
      const db = await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
      })
      const url = `${db.connection.host}:${db.connection.port}`
      console.log(`👽MongoDB conectada en ${url}`);
  } catch (error) {
      console.log(`error: ${error.message}`);
      process.exit(1)
  }
}

export default connectDB;
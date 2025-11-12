// server/mongodb/index.js
import mongoose from 'mongoose';
import dotenv from '';

dotenv.config(); // load dotenv file

export async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

import mongoose from 'mongoose';

async function connectToDataBase() {
    try {
        await mongoose.connect(env.DB_URL)
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }

}

connectToDataBase();
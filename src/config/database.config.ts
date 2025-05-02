import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
	try {
		const mongoURI = process.env.MONGODB_URI!;
		await mongoose.connect(mongoURI);
		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

export default connectDB;
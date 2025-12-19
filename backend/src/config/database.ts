import mongoose from 'mongoose';
import config from './index';

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(config.databaseUrl);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error);

        if (error.message && (error.message.includes('SSL routines') || error.message.includes('handshake failure'))) {
            console.error('\n***************************************************************');
            console.error('CONNECTION FAILED: SSL Handshake Error');
            console.error('This usually means your current IP Address is NOT whitelisted in MongoDB Atlas.');
            console.error('Please go to MongoDB Atlas -> Network Access -> Add IP Address.');
            console.error('***************************************************************\n');
        }

        process.exit(1);
    }
};

export default connectDB;

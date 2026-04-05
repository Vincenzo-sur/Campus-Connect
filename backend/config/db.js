const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);

        // In production, fail hard — don't use in-memory DB
        if (process.env.NODE_ENV === 'production') {
            console.error('Cannot start without a database in production. Exiting.');
            process.exit(1);
        }

        // In development, fall back to in-memory DB for convenience
        console.log('Starting in-memory MongoDB for local development...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            const conn = await mongoose.connect(uri);
            console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
            console.log('⚠️  Data will be lost when the server stops.');
        } catch (memError) {
            console.error(`Failed to start in-memory MongoDB: ${memError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;

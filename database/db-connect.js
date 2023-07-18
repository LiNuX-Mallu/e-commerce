const mongoose = require('mongoose');
const {DB_URI} = process.env;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('connected to database');

        mongoose.connection.on('disconnected', () => {
            console.log('lost connection to database');
            console.log('retrying to connect...');
            setTimeout(connectDB, 3000);
        });

        mongoose.connection.on('error', (error) => {
            console.log('database connection error');
            console.log('retrying to connect...');
            setTimeout(connectDB, 3000);
        });

    } catch(err) {
        console.log('failed connecting to database');
        console.log('retrying to connect...');
        setTimeout(connectDB, 5000);
    }
}

module.exports = {connectDB};
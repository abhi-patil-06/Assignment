
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const Transaction = require('../models/Transaction');
const connectDB = require('../config/db');

dotenv.config();

// Utility function to get month number (1-12) from month name
const getMonthNumber = (monthName) => {
    const date = new Date(`${monthName} 1, 2020`);
    return date.getMonth() + 1;
};

// Function to seed the database
const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('Fetching data from third-party API...');
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        if (!Array.isArray(data)) {
            throw new Error('Fetched data is not an array.');
        }

        console.log('Clearing existing transactions...');
        await Transaction.deleteMany({});

        console.log('Seeding database with new transactions...');
        const currentDate = new Date();
        const seededData = data.map((item, index) => {
            const date = new Date(currentDate);
            date.setMonth(date.getMonth() - (index % 12));
            date.setDate(Math.floor(Math.random() * 28) + 1); 
            return {
                title: item.title || 'No Title',
                description: item.description || 'No Description',
                price: typeof item.price === 'number' ? item.price : 0,
                category: item.category || 'Uncategorized',
                sold: typeof item.sold === 'boolean' ? item.sold : false,
                dateOfSale: date,
                image: item.image || ''
            };
        });

        await Transaction.insertMany(seededData);
        console.log(`Database seeded successfully with ${seededData.length} transactions.`);

        mongoose.connection.close();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error seeding database:', error.message);
        mongoose.connection.close();
        process.exit(1);
    }
};

// Execute the seed function
seedDatabase();

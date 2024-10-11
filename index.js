
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const transactionRoutes = require('./routes/transactions');

dotenv.config();

// Initialize Express App
const app = express();

// Connect to Database
connectDB();


app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Transactions API');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

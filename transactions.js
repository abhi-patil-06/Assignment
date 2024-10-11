
const express = require('express');
const router = express.Router();
const {
    seedDatabase,
    getTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData
} = require('../controllers/transactionController');

// Route to seed the database
router.get('/seed', seedDatabase);

// Route to get all transactions pagination
router.get('/', getTransactions);

// Route to get statistics for a selected month
router.get('/statistics/:month', getStatistics);

// Route to get bar chart data for a selected month
router.get('/bar-chart/:month', getBarChartData);

// Route to get pie chart data for a selected month
router.get('/pie-chart/:month', getPieChartData);

// Route to get combined data (optional)
router.get('/combined-data/:month', getCombinedData);

module.exports = router;

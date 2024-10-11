const Transaction = require('../models/Transaction');
const axios = require('axios');


const getMonthNumber = (monthName) => {
    const date = new Date(`${monthName} 1, 2020`);
    return date.getMonth() + 1;
};


const seedDatabase = async (req, res) => {
    try {
        // Fetch data from the third-party API
        console.log('Fetching data from third-party API...');
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        if (!Array.isArray(data)) {
            throw new Error('Fetched data is not an array.');
        }

        // Clear existing transactions
        console.log('Clearing existing transactions...');
        await Transaction.deleteMany({});

        // Prepare and insert new transactions
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

        res.status(200).json({ message: `Database seeded successfully with ${seededData.length} transactions.` });
    } catch (error) {
        console.error('Error seeding database:', error.message);
        res.status(500).json({ message: 'Error seeding database', error: error.message });
    }
};



const getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', month } = req.query;


        let query = {};

        if (month) {
            const monthNumber = getMonthNumber(month);
            const year = new Date().getFullYear();
            const startDate = new Date(year, monthNumber - 1, 1);
            const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);
            query.dateOfSale = { $gte: startDate, $lte: endDate };
        }

        if (search) {
            const searchNumber = parseFloat(search);
            if (!isNaN(searchNumber)) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { price: searchNumber }
                ];
            } else {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
        }

        const transactions = await Transaction.find(query)
            .sort({ dateOfSale: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Transaction.countDocuments(query);

        res.status(200).json({
            transactions,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
};

// Function to get statistics for a selected month
const getStatistics = async (req, res) => {
    try {
        const { month } = req.params;
        const monthNumber = getMonthNumber(month);
        const year = new Date().getFullYear();
        const startDate = new Date(year, monthNumber - 1, 1);
        const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

        const statistics = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: null,
                    totalSale: { $sum: "$price" },
                    totalSold: { $sum: { $cond: ["$sold", 1, 0] } },
                    totalNotSold: { $sum: { $cond: ["$sold", 0, 1] } }
                }
            }
        ]);

        if (statistics.length === 0) {
            return res.status(200).json({
                totalSale: 0,
                totalSold: 0,
                totalNotSold: 0
            });
        }

        res.status(200).json(statistics[0]);
    } catch (error) {
        console.error('Error fetching statistics:', error.message);
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
};

// Function to get bar chart data for a selected month
const getBarChartData = async (req, res) => {
    try {
        const { month } = req.params;
        const monthNumber = getMonthNumber(month);
        const year = new Date().getFullYear();
        const startDate = new Date(year, monthNumber - 1, 1);
        const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

        const barChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Number.MAX_VALUE],
                    default: "901-above",
                    output: {
                        count: { $sum: 1 }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json(barChartData);
    } catch (error) {
        console.error('Error fetching bar chart data:', error.message);
        res.status(500).json({ message: 'Error fetching bar chart data', error: error.message });
    }
};


// Function to get pie chart data for a selected month
const getPieChartData = async (req, res) => {
    try {
        const { month } = req.params;
        const monthNumber = getMonthNumber(month);
        const year = new Date().getFullYear();  
        const startDate = new Date(year, monthNumber - 1, 1);
        const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

        const pieChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json(pieChartData);
    } catch (error) {
        console.error('Error fetching pie chart data:', error.message);
        res.status(500).json({ message: 'Error fetching pie chart data', error: error.message });
    }
};

// Function to get combined data)
const getCombinedData = async (req, res) => {
    try {
        const { month } = req.params;
        const monthNumber = getMonthNumber(month);
        const year = new Date().getFullYear(); 
        const startDate = new Date(year, monthNumber - 1, 1);
        const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

        const [statistics, barChartData, pieChartData] = await Promise.all([
            Transaction.aggregate([
                { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
                {
                    $group: {
                        _id: null,
                        totalSale: { $sum: "$price" },
                        totalSold: { $sum: { $cond: ["$sold", 1, 0] } },
                        totalNotSold: { $sum: { $cond: ["$sold", 0, 1] } }
                    }
                }
            ]),
            Transaction.aggregate([
                { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
                {
                    $bucket: {
                        groupBy: "$price",
                        boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Number.MAX_VALUE],
                        default: "901-above",
                        output: {
                            count: { $sum: 1 }
                        }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Transaction.aggregate([
                { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
                {
                    $group: {
                        _id: "$category",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ])
        ]);

        res.status(200).json({
            statistics: statistics[0] || { totalSale: 0, totalSold: 0, totalNotSold: 0 },
            barChartData,
            pieChartData
        });
    } catch (error) {
        console.error('Error fetching combined data:', error.message);
        res.status(500).json({ message: 'Error fetching combined data', error: error.message });
    }
};

module.exports = {
    seedDatabase,
    getTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData
};

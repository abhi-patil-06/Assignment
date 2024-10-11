
import React, { useState, useEffect } from "react";
import axios from "axios";
import MonthDropdown from "./components/MonthDropdown";
import TransactionsTable from "./components/TransactionsTable";
import BarChartComponent from "./components/BarChartComponent";
import PieChartComponent from "./components/PieChartComponent";
import Statistics from "./components/Statistics";
import './App.css'; 

const App = () => {
    const [selectedMonth, setSelectedMonth] = useState("March");
    const [statistics, setStatistics] = useState(null);
    const [barChartData, setBarChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);

    const fetchCombinedData = async (month) => {
        try {
            const [statisticsRes, barChartRes, pieChartRes] = await Promise.all([
                axios.get(`/api/transactions/statistics/${month}`),
                axios.get(`/api/transactions/bar-chart/${month}`),
                axios.get(`/api/transactions/pie-chart/${month}`)
            ]);

            setStatistics(statisticsRes.data);
            setBarChartData(barChartRes.data);
            setPieChartData(pieChartRes.data);
        } catch (error) {
            console.error("Error fetching combined data:", error);
        }
    };

    useEffect(() => {
        fetchCombinedData(selectedMonth);
    }, [selectedMonth]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Transaction Dashboard</h1>
            <MonthDropdown selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
            <Statistics statistics={statistics} />
            <TransactionsTable selectedMonth={selectedMonth} />
            <BarChartComponent barChartData={barChartData} />
            <PieChartComponent pieChartData={pieChartData} />
        </div>
    );
};

export default App;


import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from "axios";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChartComponent = ({ selectedMonth }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBarChartData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/transactions/bar-chart/${selectedMonth}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching bar chart data:", error);
            setError("Failed to fetch bar chart data. Please try again later.");
        }
        setLoading(false);
    }, [selectedMonth]);

    useEffect(() => {
        fetchBarChartData();
    }, [fetchBarChartData]);

    if (loading) return <p style={{ textAlign: 'center' }}>Loading bar chart...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    if (!data) return null;

    const labels = ["0-100", "101-200", "201-300", "301-400", "401-500", "501-600", "601-700", "701-800", "801-900", "901-above"];
    const dataCounts = labels.map(label => {
        const found = data.find(item => item._id === label);
        return found ? found.count : 0;
    });

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Number of Items',
                data: dataCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Price Range Distribution',
            },
        },
    };

    return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ textAlign: 'center' }}>Bar Chart</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BarChartComponent;

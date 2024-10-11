
import React from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const PieChartComponent = ({ pieChartData }) => {
    if (!pieChartData) return null;

    const labels = pieChartData.map(item => item._id);
    const dataCounts = pieChartData.map(item => item.count);

    const data = {
        labels,
        datasets: [
            {
                label: 'Category Distribution',
                data: dataCounts,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#C9CBCF',
                    '#8A2BE2',
                    '#00FA9A',
                    '#FFD700'
                ],
                hoverOffset: 4
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Category Distribution',
            },
        },
    };

    return (
        <div style={{ marginTop: '40px' }}>
            <h2>Pie Chart</h2>
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChartComponent;

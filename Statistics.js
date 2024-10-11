
import React from "react";

const Statistics = ({ statistics }) => {
    if (!statistics) return null;

    return (
        <div style={{
            margin: '20px 0',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
        }}>
            <h2>Statistics</h2>
            <p><strong>Total Sale Amount:</strong> ${statistics.totalSale.toFixed(2)}</p>
            <p><strong>Total Sold Items:</strong> {statistics.totalSold}</p>
            <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSold}</p>
        </div>
    );
};

export default Statistics;

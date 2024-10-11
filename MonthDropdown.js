
import React from "react";

const MonthDropdown = ({ selectedMonth, setSelectedMonth }) => {
    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    return (
        <div style={{ marginBottom: '20px' }}>
            <label htmlFor="month-select" style={{ marginRight: '10px' }}>Select Month:</label>
            <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ padding: '5px' }}
            >
                {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                ))}
            </select>
        </div>
    );
};

export default MonthDropdown;

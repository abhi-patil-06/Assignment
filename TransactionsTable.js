
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const TransactionsTable = ({ selectedMonth }) => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const perPage = 10;

    const fetchTransactions = useCallback(async (page = 1, search = "") => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/transactions', {
                params: {
                    month: selectedMonth,
                    page,
                    limit: perPage,
                    search
                }
            });
            setTransactions(response.data.transactions);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setError("Failed to fetch transactions. Please try again later.");
        }
        setLoading(false);
    }, [selectedMonth]);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchTransactions(1, searchTerm);
    };

    // Handle next page
    const handleNext = () => {
        if (currentPage < totalPages) {
            fetchTransactions(currentPage + 1, searchTerm);
        }
    };

    // Handle previous page
    const handlePrevious = () => {
        if (currentPage > 1) {
            fetchTransactions(currentPage - 1, searchTerm);
        }
    };

    // Fetch transactions when selectedMonth changes
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <div>
            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by Title, Description, or Price"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '10px', width: '300px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', border: 'none', backgroundColor: '#4CAF50', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                    Search
                </button>
            </form>

            {/* Error Message */}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {/* Transactions Table */}
            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading transactions...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price ($)</th>
                            <th>Category</th>
                            <th>Sold</th>
                            <th>Date of Sale</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx._id}>
                                    <td>{tx.title}</td>
                                    <td>{tx.description}</td>
                                    <td>{tx.price.toFixed(2)}</td>
                                    <td>{tx.category}</td>
                                    <td>{tx.sold ? "Yes" : "No"}</td>
                                    <td>{new Date(tx.dateOfSale).toLocaleDateString()}</td>
                                    <td>
                                        {tx.image ? (
                                            <img src={tx.image} alt={tx.title} width="50" />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <button onClick={handlePrevious} disabled={currentPage === 1} style={{ padding: '10px 20px', marginRight: '10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNext} disabled={currentPage === totalPages} style={{ padding: '10px 20px', marginLeft: '10px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
                    Next
                </button>
            </div>
        </div>
    );

};

export default TransactionsTable;

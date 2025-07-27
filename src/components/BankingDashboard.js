import React, { useState, useEffect } from 'react';
import './Auth.css';

const BankingDashboard = ({ user, onLogout }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Fetch all accounts on component mount
  useEffect(() => {
    fetchAllAccounts();
  }, []);

  // Fetch account details when selectedAccount changes
  useEffect(() => {
    if (selectedAccount) {
      fetchAccountDetails(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchAllAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/accounts/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts);
        // Auto-select the first account
        if (data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0].account_number);
        }
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setError('Failed to load accounts');
    } finally {
      setLoadingAccounts(false);
    }
  };

  const fetchAccountDetails = async (accountNumber) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/accounts/details/${accountNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAccountDetails(data);
        setTransactions(data.recent_transactions);
      }
    } catch (error) {
      console.error('Failed to fetch account details:', error);
      setError('Failed to load account details');
    }
  };

  const handleAccountSelect = (accountNumber) => {
    setSelectedAccount(accountNumber);
    setError('');
    setSuccess('');
  };

  const handleTransaction = async (type) => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!selectedAccount) {
      setError('Please select an account');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'deposit' ? 'deposit' : 'withdraw';
      
      const response = await fetch(`http://localhost:5000/api/accounts/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount: parseFloat(amount),
          account_number: selectedAccount 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setAmount('');
        // Refresh account data
        fetchAllAccounts();
        fetchAccountDetails(selectedAccount);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  if (loadingAccounts) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Loading your accounts...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome {user.name || user.full_name}</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
        {/* User Information */}
        <div className="user-info">
          <h3>Your Profile</h3>
          <p><strong>Customer ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Full Name:</strong> {user.name || user.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        {/* Account Selection */}
        <div className="accounts-section">
          <h3>Your Accounts ({accounts.length})</h3>
          <div className="accounts-grid">
            {accounts.map((account) => (
              <button
                key={account.account_number}
                className={`account-card ${selectedAccount === account.account_number ? 'selected' : ''}`}
                onClick={() => handleAccountSelect(account.account_number)}
              >
                <div className="account-header">
                  <h4>Account #{account.account_number}</h4>
                  <span className="account-type">{account.account_type || 'Savings'}</span>
                </div>
                <div className="account-balance">
                  <span className="balance-label">Balance:</span>
                  <span className="balance-amount">${account.balance.toFixed(2)}</span>
                </div>
                <div className="account-date">
                  Opened: {new Date(account.date_opened).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Account Details */}
        {accountDetails && (
          <>
            <div className="selected-account-details">
              <h3>Account #{selectedAccount} Details</h3>
              <div className="account-summary">
                <div className="summary-item">
                  <span className="label">Current Balance:</span>
                  <span className="value balance">${accountDetails.balance.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Account Number:</span>
                  <span className="value">{accountDetails.account_number}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Date Opened:</span>
                  <span className="value">{new Date(accountDetails.date_opened).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Transaction Section */}
            <div className="transaction-section">
              <h3>Make a Transaction</h3>
              
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              <div className="transaction-form">
                <div className="selected-account-info">
                  <p>Transacting on: <strong>Account #{selectedAccount}</strong></p>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  className="amount-input"
                />
                <div className="transaction-buttons">
                  <button 
                    className="deposit-button"
                    onClick={() => handleTransaction('deposit')}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Deposit'}
                  </button>
                  <button 
                    className="withdraw-button"
                    onClick={() => handleTransaction('withdraw')}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Withdraw'}
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="transaction-history">
              <h3>Recent Transactions - Account #{selectedAccount}</h3>
              {transactions.length > 0 ? (
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.transaction_id}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className={`transaction-type ${transaction.transaction_type.toLowerCase()}`}>
                          {transaction.transaction_type}
                        </td>
                        <td className={`transaction-amount ${transaction.transaction_type.toLowerCase()}`}>
                          {transaction.transaction_type === 'Deposit' ? '+' : '-'}
                          ${parseFloat(transaction.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No transactions yet for this account. Make your first deposit or withdrawal!</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BankingDashboard;

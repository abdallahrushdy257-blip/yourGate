import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Title from '../../components/title';
import './treeStore.css';
import { faTree } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TreeStore() {
    const [accounts, setAccounts] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/user/5/accounts/tree')
            .then((response) => {
                console.log('API Response:', response.data);
                const accountsData = response.data.data ? Object.values(response.data.data) : [];
                console.log('Accounts Data:', accountsData);
                setAccounts(accountsData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching accounts:", err);
                setError('Failed to fetch account tree');
                setLoading(false);
            });
    }, []);

    const renderAccountRows = (accountsList) => {
        if (!Array.isArray(accountsList)) {
            console.error("Expected an array, but received:", accountsList);
            return <tr><td colSpan="6">No valid data available</td></tr>;
        }

        return accountsList.map((account) => (
            <React.Fragment key={account.id}>
                <tr>
                    <td className={`accnumtree acc-${account.account_level}`}>
                        {account.account_number}
                    </td>
                    <td>{account.account_name}</td>
                    <td>{account.account_description || 'No description'}</td>
                    <td>{account.is_payable ? 'Yes' : 'No'}</td>
                    <td>{account.account_balance || '0'}</td>
                </tr>
                {account.children && account.children.length > 0 && renderAccountRows(account.children)}
            </React.Fragment>
        ));
        
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const filteredAccounts = accounts.filter(account => {
        switch (activeTab) {
            case 1:
                return account.account_number.startsWith('1');
            case 2:
                return account.account_number.startsWith('2');
            case 3:
                return account.account_number.startsWith('3');
            case 4:
                return account.account_number.startsWith('4');
            case 5:
                return account.account_number.startsWith('5');
            default:
                return true;
        }
    });

    if (loading) {
        return <p>Loading account tree...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="treeStore">
            <Title title="شجرة الحسابات" icon={<FontAwesomeIcon icon={faTree} />} />
            <div className="treetabs">
                <button
                    onClick={() => handleTabClick(1)}
                    className={activeTab === 1 ? 'active' : ''}
                >
                    الأصول
                </button>
                <button
                    onClick={() => handleTabClick(2)}
                    className={activeTab === 2 ? 'active' : ''}
                >
                    الالتزامات
                </button>
                <button
                    onClick={() => handleTabClick(3)}
                    className={activeTab === 3 ? 'active' : ''}
                >
                    حقوق الملكية
                </button>
                <button
                    onClick={() => handleTabClick(4)}
                    className={activeTab === 4 ? 'active' : ''}
                >
                    المصروفات
                </button>
                <button
                    onClick={() => handleTabClick(5)}
                    className={activeTab === 5 ? 'active' : ''}
                >
                    الإيرادات
                </button>
            </div>

            <table className="accountTable">
                <thead>
                    <tr>
                        <th>رقم الحساب</th>
                        <th>اسم الحساب</th>
                        <th>الوصف</th>
                        <th>يمكن الدفع والتحصيل عليه</th>
                        <th>الرصيد</th>
                    </tr>
                </thead>
                <tbody>
                    {renderAccountRows(filteredAccounts)}  
                </tbody>
            </table>
        </div>
    );
}

export default TreeStore;

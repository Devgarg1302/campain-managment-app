import React, { useEffect, useState } from 'react';
import './groups.css';
const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audienceSize, setaudienceSize] = useState(null);

  // Fetch all groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/groups'); // API to list all groups
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const formatDate = (mongoDate) => {
    const date = new Date(mongoDate);
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  // Fetch customers for the selected group
  const handleGroupClick = async (group_id) => {
    setLoading(true);
    setSelectedGroup(group_id);
    setCustomers([]);

    try {
      const response = await fetch(`http://localhost:3000/api/group/${group_id}`);
      const data = await response.json();
      setCustomers(data.customers);
      setaudienceSize(data.audienceSize);

    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseConditions = (conditions) => {
    if (!conditions) return 'No conditions available';
  
    const parseOperator = (operator) => {
      switch (operator) {
        case '$gt': return 'greater than';
        case '$lt': return 'less than';
        case '$gte': return 'greater than or equal to';
        case '$lte': return 'less than or equal to';
        case '$eq': return 'equal to';
        default: return operator;
      }
    };
  
    const formatCondition = (condition) => {
      if (condition.$and) {
        return '(' + condition.$and.map(formatCondition).join(' AND ') + ')';
      }
      if (condition.$or) {
        return '(' + condition.$or.map(formatCondition).join(' OR ') + ')';
      }
      return Object.entries(condition)
        .map(([field, value]) => {
          if (typeof value === 'object' && value !== null) {
            const [operator, val] = Object.entries(value)[0];
            return `${field} is ${parseOperator(operator)} ${val}`;
          }
          return `${field}: ${value}`;
        })
        .join(', ');
    };
  
    return formatCondition(conditions);
  };
  
  return (
    <div>
      <h2>Groups</h2>
      <ul>
        {groups?.map((group) => (
          <li key={group.group_id}>
            <button className="group" onClick={() => handleGroupClick(group.group_id)}>
              <p>View Customers for Group</p> 
              <p>Group_id: {group.group_id}</p>   
              <p>Conditions: {parseConditions(group.group_conditions)}</p>
            </button>
          </li>
        ))}
      </ul>

      {loading && <p>Loading customers...</p>}

      {selectedGroup && !loading && (
        <div className='customer-list'>
          <h3>Customers for Group {selectedGroup}</h3>
          <p>Audience Size: {audienceSize} </p>
          <ul>
            {customers?.map((customer) => (
              <li key={customer._id}>
                [Name: {customer.name}] - [Email:{customer.email}] - [totalSpending:{customer.totalSpending}] - [Visits:{customer.visits}] - [lastVisit:{formatDate(customer.lastVisit)}]
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Groups;

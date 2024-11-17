import axios from 'axios';
import React, { useState } from 'react';

const AudienceCreator = () => {
  const [conditions, setConditions] = useState([
    { field: '', operators: [{ operator: '', value: '' }], connector: '' },
  ]);

  // Add a new condition
  const addCondition = () => {
    setConditions([...conditions, { field: '', operators: [{ operator: '', value: '' }], connector: '' }]);
  };

  const saveCondition = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/audience/filter-and-save', { conditions });
      console.log(response);
    } catch (error) {
      console.error('Error calculating audience size:', error);
    }
  };

  // Add an operator for a specific condition
  const addOperator = (conditionIndex) => {
    const updatedConditions = [...conditions];
    updatedConditions[conditionIndex].operators.push({ operator: '', value: '' });
    setConditions(updatedConditions);
  };

  // Handle changes in conditions
  const handleConditionChange = (conditionIndex, key, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[conditionIndex][key] = value;
    setConditions(updatedConditions);
  };

  // Handle changes in operators
  const handleOperatorChange = (conditionIndex, operatorIndex, key, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[conditionIndex].operators[operatorIndex][key] = value;
    setConditions(updatedConditions);
  };

  // Remove an operator from a specific condition
  const removeOperator = (conditionIndex, operatorIndex) => {
    const updatedConditions = [...conditions];
    updatedConditions[conditionIndex].operators.splice(operatorIndex, 1);
    setConditions(updatedConditions);
  };

  // Remove a condition
  const removeCondition = (index) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };

  return (
    <div>
      <h2>Create Audience Segment</h2>
      {conditions.map((condition, conditionIndex) => (
        <div key={conditionIndex} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
          {/* Field Selection */}
          <select
            value={condition.field}
            onChange={(e) => handleConditionChange(conditionIndex, 'field', e.target.value)}
          >
            <option value="">Select Field</option>
            <option value="totalSpending">Total Spending</option>
            <option value="visits">Visits</option>
            <option value="lastVisit">Last Visit</option>
          </select>

          {/* Operators */}
          {condition.operators.map((operator, operatorIndex) => (
            <div key={operatorIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <select
                value={operator.operator}
                onChange={(e) =>
                  handleOperatorChange(conditionIndex, operatorIndex, 'operator', e.target.value)
                }
              >
                <option value="">Select Operator</option>
                <option value="gt">Greater Than</option>
                <option value="lt">Less Than</option>
                <option value="gte">Greater Than or Equal To</option>
                <option value="lte">Less Than or Equal To</option>
                <option value="eq">Equal To</option>
              </select>

              <input
                type={condition.field === 'lastVisit' ? 'date' : 'number'}
                value={operator.value}
                onChange={(e) =>
                  handleOperatorChange(conditionIndex, operatorIndex, 'value', e.target.value)
                }
                placeholder="Enter Value"
                style={{ marginLeft: '10px' }}
              />

              {condition.operators.length > 1 && (
                <button
                  onClick={() => removeOperator(conditionIndex, operatorIndex)}
                  style={{
                    marginLeft: '10px',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {/* Add Operator Button */}
          <button
            onClick={() => addOperator(conditionIndex)}
            style={{
              marginBottom: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              padding: '5px 10px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Add Operator
          </button>

          {/* Remove Condition Button */}
          {conditions.length > 1 && (
            <button
              onClick={() => removeCondition(conditionIndex)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Remove Condition
            </button>
          )}

          {/* Logical Connector */}
          {conditionIndex > 0 && (
            <select
              value={condition.connector}
              onChange={(e) => handleConditionChange(conditionIndex, 'connector', e.target.value)}
              style={{ marginTop: '10px' }}
            >
              <option value="">Select Connector</option>
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}
        </div>
      ))}

      {/* Add Condition Button */}
      <button
        onClick={addCondition}
        style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Add Condition
      </button>

      <button
        onClick={saveCondition}
        style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Save Condition
      </button>

      {/* Display the constructed conditions */}
      <pre>{JSON.stringify(conditions, null, 2)}</pre>
    </div>
  );
};

export default AudienceCreator;

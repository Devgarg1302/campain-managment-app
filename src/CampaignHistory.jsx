import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [show, setShow] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedCampaign, setselectedCampaign] = useState(null);
  const [logs, setlogs] = useState([]);
  
  const handleCampaignClick = async (campaignId) =>{
    setselectedCampaign(campaignId);
    setlogs([]);

    try {
      const response = await fetch(`http://localhost:3000/api/campaign/${campaignId}`);
      const data = await response.json();
      setlogs(data.log);

    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }

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


  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/campaign/history');
        
        setCampaigns(response.data.campaigns);

      } catch (error) {
        console.error('Error fetching campaign history:', error);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching campaign history:', error);
      }
    };

    fetchCampaigns();
    fetchGroups();
  }, []);

  return (
    <> 

    <h2>Campaign History</h2>
    <button style={{marginLeft:'20px'}} onClick={()=>setShow(true)}>Add Campaign</button>
    {show &&(
      <div>
        <form action="http://localhost:3000/submit" method="POST">
          <label htmlFor="name">Campaign Name</label>
          <input type="text" name="name" id="name" />

          <label htmlFor="description">Campaign Description</label>
          <input type="text" name="description" id="description" />

          <label htmlFor="groups">Select Group</label>
          <select name="groups" id="groups">
            <option value="">Choose</option>
            {groups?.map((group)=>(
              <option key={group.group_id} value={group.group_id}>
                
                  {group.group_id}  - {parseConditions(group.group_conditions)} 
                
              </option>
            ))}
            
          </select>

          <button type='submit'>Save Campaign</button>
        </form>
      </div>
    )
    };
    <div className='campaign-cont'>
      {campaigns.map((campaign) => (
        <div className="campaign-card" key={campaign._id} onClick={() => handleCampaignClick(campaign._id)}>
          <h3>{campaign.name}</h3>
          <p><strong>Description:</strong> {campaign.description}</p>
          <p><strong>Group ID:</strong> {campaign.group_id}</p>
          <p><strong>Date:</strong> {new Date(campaign.created_at).toLocaleDateString()}</p>
          <p><strong>Audience Size</strong> {campaign.audienceSize}</p>
        </div>
      ))}
    </div>

    {selectedCampaign && (
        <div className='customer-list'>
          <h3>Details for Campaign {selectedCampaign}</h3>
          {logs.map((log) => (
            <>
            <p key={log._id} >Audience Size: {log.audienceSize}  </p>
            <ul>
              <li>
                [campaignId: {log.campaignId}] - [Message Sent:{log.message_sent}] - [Message Failed:{log.message_failed}]
              </li>
          </ul>
          </>
          ))}
        </div>
      )}

    </>
  );
}

export default CampaignHistory;

import React from 'react';
import ApplicationCard from './ApplicationCard';

const CompanyTop50List = ({ items }) => {
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  if (!items || items.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-content">
          <div className="no-results-icon">🏆</div>
          <h3>榜单正在快马加鞭制作中...</h3>
          <p>敬请期待</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-sections">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="applications-grid">
            {items.map((item, index) => (
              <ApplicationCard
                key={index}
                name={item.name}
                url={item.website}
                logo={item.icon}
                description={item.description}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyTop50List;

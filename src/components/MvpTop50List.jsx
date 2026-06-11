import React from 'react';
import ApplicationCard from './ApplicationCard';

const MvpTop50List = ({ items }) => {
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
    <div className="top100-list">
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
  );
};

export default MvpTop50List;

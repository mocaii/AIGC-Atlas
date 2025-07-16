import React from 'react';
import PropTypes from 'prop-types';

function StatsBar({ totalApps, totalCategories, searchTerm }) {
  return (
    <div className="stats-bar">
      <div className="stats-item">
        <span className="stats-icon">🚀</span>
        <span className="stats-text">
          {totalApps} 个应用
        </span>
      </div>
      <div className="stats-item">
        <span className="stats-icon">📂</span>
        <span className="stats-text">
          {totalCategories} 个分类
        </span>
      </div>
      {searchTerm && (
        <div className="stats-item search-result">
          <span className="stats-icon">🔍</span>
          <span className="stats-text">
            搜索: "{searchTerm}"
          </span>
        </div>
      )}
    </div>
  );
}

StatsBar.propTypes = {
  totalApps: PropTypes.number.isRequired,
  totalCategories: PropTypes.number.isRequired,
  searchTerm: PropTypes.string,
};

StatsBar.defaultProps = {
  searchTerm: '',
};

export default StatsBar;

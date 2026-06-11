import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const AICodingAppsList = ({ data, searchTerm }) => {
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const lowercasedFilter = searchTerm.toLowerCase();
    return data.filter(category => {
      const filteredApps = category.apps.filter(app =>
        app.name.toLowerCase().includes(lowercasedFilter) ||
        app.description.toLowerCase().includes(lowercasedFilter)
      );
      return filteredApps.length > 0;
    }).map(category => ({
      ...category,
      apps: category.apps.filter(app =>
        app.name.toLowerCase().includes(lowercasedFilter) ||
        app.description.toLowerCase().includes(lowercasedFilter)
      )
    }));
  }, [data, searchTerm]);

  const totalApps = useMemo(() => {
    return filteredData.reduce((total, category) => total + category.apps.length, 0);
  }, [filteredData]);

  if (filteredData.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-content">
          <div className="no-results-icon">🔍</div>
          <h3>未找到相关应用</h3>
          <p>尝试使用其他关键词搜索</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-coding-apps-container">
      <div className="stats-summary">
        <div className="stats-item">
          <span className="stats-number">{totalApps}</span>
          <span className="stats-label">AI编程应用</span>
        </div>
        <div className="stats-item">
          <span className="stats-number">{filteredData.length}</span>
          <span className="stats-label">应用分类</span>
        </div>
      </div>

      {filteredData.map((category, index) => (
        <div key={index} className="category-section">
          <div className="category-header">
            <h2 className="category-title">{category.category}</h2>
            <span className="category-count">{category.apps.length} 个应用</span>
          </div>
          
          <div className="apps-grid">
            {category.apps.map((app, appIndex) => (
              <div key={appIndex} className="app-card">
                <div className="app-header">
                  <div className="app-icon">
                    <span>💻</span>
                  </div>
                  <div className="app-info">
                    <h3 className="app-name">{app.name}</h3>
                    <a 
                      href={app.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="app-website"
                    >
                      {app.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
                <p className="app-description">{app.description}</p>
                <div className="app-actions">
                  <a 
                    href={app.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="visit-btn"
                  >
                    访问应用
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

AICodingAppsList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      apps: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          website: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          icon: PropTypes.string
        })
      ).isRequired
    })
  ).isRequired,
  searchTerm: PropTypes.string
};

AICodingAppsList.defaultProps = {
  searchTerm: ''
};

export default AICodingAppsList;
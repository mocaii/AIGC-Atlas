import React, { useState, useMemo } from 'react';

const AI100RankingList = ({ data, searchTerm }) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (categoryPath) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryPath]: !prev[categoryPath],
    }));
  };

  const filteredData = useMemo(() => {
    if (!searchTerm || !data) {
      return data || {};
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = {};

    for (const topCategory in data) {
      filtered[topCategory] = {};
      for (const midCategory in data[topCategory]) {
        filtered[topCategory][midCategory] = {};
        for (const subCategory in data[topCategory][midCategory]) {
          const apps = data[topCategory][midCategory][subCategory].filter(
            (app) =>
              app.name.toLowerCase().includes(lowercasedFilter) ||
              (app.description && app.description.toLowerCase().includes(lowercasedFilter))
          );
          if (apps.length > 0) {
            filtered[topCategory][midCategory][subCategory] = apps;
          }
        }
        if (Object.keys(filtered[topCategory][midCategory]).length === 0) {
          delete filtered[topCategory][midCategory];
        }
      }
      if (Object.keys(filtered[topCategory]).length === 0) {
        delete filtered[topCategory];
      }
    }
    return filtered;
  }, [data, searchTerm]);

  const renderApplicationCard = (app, index) => {
    return (
      <a
        key={index}
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        className="ai100-app-card"
      >
        <div className="ai100-app-header">
          <img
            src={app.iconUrl || '/api/placeholder/48/48'}
            alt={`${app.name} 图标`}
            className="ai100-app-icon"
            onError={(e) => {
              e.target.src = '/api/placeholder/48/48';
            }}
          />
          <h4 className="ai100-app-name">{app.name}</h4>
        </div>
        <p className="ai100-app-description">{app.description}</p>
        <div className="ai100-app-url">{app.url}</div>
      </a>
    );
  };

  const renderApplications = (applications) => {
    return (
      <div className="ai100-apps-grid">
        {applications.map((app, index) => renderApplicationCard(app, index))}
      </div>
    );
  };

  const renderSubCategories = (subCategories, midCategoryName, topCategoryName) => {
    return Object.entries(subCategories).map(([subCategoryName, applications]) => {
      const categoryPath = `${topCategoryName}-${midCategoryName}-${subCategoryName}`;
      const isExpanded = expandedCategories[categoryPath] !== false; // 默认展开

      return (
        <div key={subCategoryName} className="ai100-subcategory">
          <div className="ai100-subcategory-header" onClick={() => toggleCategory(categoryPath)}>
            <h4 className="ai100-subcategory-title">
              <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▶</span>
              {subCategoryName}
              <span className="ai100-app-count">{applications.length}</span>
            </h4>
          </div>
          {isExpanded && renderApplications(applications)}
        </div>
      );
    });
  };

  const renderMidCategories = (midCategories, topCategoryName) => {
    return Object.entries(midCategories).map(([midCategoryName, subCategories]) => {
      const categoryPath = `${topCategoryName}-${midCategoryName}`;
      const isExpanded = expandedCategories[categoryPath] !== false; // 默认展开

      // 计算总应用数量
      const totalApps = Object.values(subCategories).reduce((sum, apps) => sum + apps.length, 0);

      return (
        <div key={midCategoryName} className="ai100-subcategory">
          <div className="ai100-subcategory-header" onClick={() => toggleCategory(categoryPath)}>
            <h3 className="ai100-subcategory-title">
              <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▶</span>
              {midCategoryName}
              <span className="ai100-app-count">{totalApps}</span>
            </h3>
          </div>
          {isExpanded && (
            <div className="ai100-subcategory-content">
              {renderSubCategories(subCategories, midCategoryName, topCategoryName)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!data || Object.keys(filteredData).length === 0) {
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
    <div className="ai100-ranking-container">
      {Object.entries(filteredData).map(([topCategoryName, midCategories]) => {
        const categoryPath = topCategoryName;
        const isExpanded = expandedCategories[categoryPath] !== false; // 默认展开

        // 计算总应用数量
        const totalApps = Object.values(midCategories).reduce(
          (midSum, subCategories) =>
            midSum + Object.values(subCategories).reduce((subSum, apps) => subSum + apps.length, 0),
          0
        );

        return (
          <div key={topCategoryName} className="ai100-category-section">
            <div className="ai100-category-header" onClick={() => toggleCategory(categoryPath)}>
              <h2 className="ai100-category-title">
                <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▶</span>
                {topCategoryName}
                <span className="ai100-app-count">{totalApps}</span>
              </h2>
            </div>
            {isExpanded && (
              <div className="ai100-category-content">
                {renderMidCategories(midCategories, topCategoryName)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AI100RankingList;

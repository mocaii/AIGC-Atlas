import React, { useMemo } from 'react';
import '../styles/CreativeAI100List.css';

const CreativeAI100List = ({ data, searchTerm }) => {
  const filteredData = useMemo(() => {
    if (!searchTerm || !data) {
      return data;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = {};

    for (const topCategory in data) {
      filtered[topCategory] = {};

      for (const toolType in data[topCategory]) {
        filtered[topCategory][toolType] = {};

        for (const subCategory in data[topCategory][toolType]) {
          const apps = data[topCategory][toolType][subCategory].filter(
            (app) =>
              app.name.toLowerCase().includes(lowercasedFilter) ||
              app.description.toLowerCase().includes(lowercasedFilter)
          );

          if (apps.length > 0) {
            filtered[topCategory][toolType][subCategory] = apps;
          }
        }

        if (Object.keys(filtered[topCategory][toolType]).length === 0) {
          delete filtered[topCategory][toolType];
        }
      }

      if (Object.keys(filtered[topCategory]).length === 0) {
        delete filtered[topCategory];
      }
    }

    return filtered;
  }, [data, searchTerm]);

  if (!filteredData || Object.keys(filteredData).length === 0) {
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
    <div className="creative-ai-100-container">
      {Object.entries(filteredData).map(([topCategory, toolTypes]) => (
        <div key={topCategory} className="top-category-section">
          <h2 className="top-category-title">{topCategory}</h2>

          {Object.entries(toolTypes).map(([toolType, subCategories]) => (
            <div key={toolType} className="tool-type-section">
              <h3 className="tool-type-title">{toolType}</h3>

              <div className="sub-categories-grid">
                {Object.entries(subCategories).map(([subCategory, apps]) => (
                  <div key={subCategory} className="sub-category-card">
                    <h4 className="sub-category-title">{subCategory}</h4>

                    <div className="apps-list">
                      {apps.map((app, index) => (
                        <div key={index} className="app-item">
                          <div className="app-header">
                            <img
                              src={app.iconUrl}
                              alt={`${app.name} icon`}
                              className="app-icon"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <div className="app-info">
                              <h5 className="app-name">
                                <a
                                  href={app.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="app-link"
                                >
                                  {app.name}
                                </a>
                              </h5>
                              <a
                                href={app.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="app-url"
                              >
                                {app.url}
                              </a>
                            </div>
                          </div>
                          <p className="app-description">{app.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CreativeAI100List;

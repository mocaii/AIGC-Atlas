import React, { useState, useMemo } from "react";
import CategorySection from "./components/CategorySection";
import appData from "./data/applications.json";
import "./styles/App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return appData;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = {};
    for (const topCategory in appData) {
      filtered[topCategory] = {};
      for (const midCategory in appData[topCategory]) {
        if (Array.isArray(appData[topCategory][midCategory])) {
          const apps = appData[topCategory][midCategory].filter((app) =>
            app.name.toLowerCase().includes(lowercasedFilter)
          );
          if (apps.length > 0) {
            filtered[topCategory][midCategory] = apps;
          }
        } else {
          filtered[topCategory][midCategory] = {};
          for (const subCategory in appData[topCategory][midCategory]) {
            if (Array.isArray(appData[topCategory][midCategory][subCategory])) {
              const apps = appData[topCategory][midCategory][subCategory].filter((app) =>
                app.name.toLowerCase().includes(lowercasedFilter)
              );
              if (apps.length > 0) {
                filtered[topCategory][midCategory][subCategory] = apps;
              }
            } else {
              filtered[topCategory][midCategory][subCategory] = {};
              for (const finalCategory in appData[topCategory][midCategory][subCategory]) {
                const apps = appData[topCategory][midCategory][subCategory][finalCategory].filter(
                  (app) => app.name.toLowerCase().includes(lowercasedFilter)
                );
                if (apps.length > 0) {
                  filtered[topCategory][midCategory][subCategory][finalCategory] = apps;
                }
              }
              if (Object.keys(filtered[topCategory][midCategory][subCategory]).length === 0) {
                delete filtered[topCategory][midCategory][subCategory];
              }
            }
          }
          if (Object.keys(filtered[topCategory][midCategory]).length === 0) {
            delete filtered[topCategory][midCategory];
          }
        }
      }
      if (Object.keys(filtered[topCategory]).length === 0) {
        delete filtered[topCategory];
      }
    }
    return filtered;
  }, [searchTerm]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🤖 2025中国 AIGC 应用全景图谱</h1>
        <p>探索人工智能应用的无限可能 · 数据来源：量子位智库</p>
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="搜索你感兴趣的 AI 应用..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </header>

      <main className="app-main">
        {Object.keys(filteredData).length === 0 ? (
          <div className="no-results">
            <div className="no-results-content">
              <div className="no-results-icon">🔍</div>
              <h3>未找到相关应用</h3>
              <p>尝试使用其他关键词搜索</p>
            </div>
          </div>
        ) : (
          Object.entries(filteredData).map(([topCategory, midLevelContent]) => (
            <div key={topCategory} className="top-category-container">
              <h2>{topCategory}</h2>
              {Object.entries(midLevelContent).map(([midCategory, subLevelContent]) => {
                if (Array.isArray(subLevelContent)) {
                  return (
                    <div key={midCategory} className="mid-category-container direct-apps">
                      <CategorySection
                        key={midCategory}
                        title={midCategory}
                        applications={subLevelContent}
                      />
                    </div>
                  );
                } else if (typeof subLevelContent === "object" && subLevelContent !== null) {
                  return (
                    <div key={midCategory} className="mid-category-container">
                      <h3>{midCategory}</h3>
                      <div className="sections-wrapper">
                        {Object.entries(subLevelContent).map(([subCategory, finalLevelContent]) => {
                          if (Array.isArray(finalLevelContent)) {
                            return (
                              <CategorySection
                                key={subCategory}
                                title={subCategory}
                                applications={finalLevelContent}
                              />
                            );
                          } else if (
                            typeof finalLevelContent === "object" &&
                            finalLevelContent !== null
                          ) {
                            return (
                              <div key={subCategory} className="sub-category-container-nested">
                                <h4 className="nested-sub-category-title">{subCategory}</h4>
                                {Object.entries(finalLevelContent).map(
                                  ([finalCategory, applications]) => (
                                    <CategorySection
                                      key={finalCategory}
                                      title={finalCategory}
                                      applications={applications}
                                    />
                                  )
                                )}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))
        )}
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} 中国 AIGC 应用全景图谱 · 持续更新中</p>
      </footer>
    </div>
  );
}

export default App;

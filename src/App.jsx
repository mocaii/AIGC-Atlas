import React, { useState, useMemo, useEffect } from 'react';
import CategorySection from './components/CategorySection';
import appData from './data/applications.json';
import Top100List from './components/Top100List';
import top100DataRaw from './data/top100.json';
import atlasImg from './data/atlas.jpg';
import './styles/App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('applications');
  const [showAtlas, setShowAtlas] = useState(false);
  const [theme, setTheme] = useState('dark');

  // 切换 body class
  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 处理 top100 数据
  const top100Items = React.useMemo(() => {
    if (top100DataRaw && top100DataRaw.data && Array.isArray(top100DataRaw.data.items)) {
      return top100DataRaw.data.items;
    }
    return [];
  }, []);

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
      {/* Tab Bar 置于页面最顶部 */}
      <div className="tab-bar-row">
        <div className="tab-bar">
          <button
            className={activeTab === 'applications' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('applications')}
          >
            应用全景
          </button>
          <button
            className={activeTab === 'top100' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('top100')}
          >
            TOP100 榜单
          </button>
        </div>
        <div className="theme-toggle-wrapper">
          <button className="theme-toggle-btn" onClick={toggleTheme} title="切换明暗模式">
            {theme === 'dark' ? (
              <span role="img" aria-label="亮色模式">
                ☁️
              </span>
            ) : (
              <span role="img" aria-label="暗色模式">
                ✨
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Header 根据标签页切换内容 */}
      <header className="app-header">
        {activeTab === 'applications' ? (
          <>
            <div className="atlas-btn-link-wrapper"></div>
            <h1>🤖 2025中国 AIGC 应用全景图谱</h1>
            <p>
              探索人工智能应用的无限可能 · 数据来源：量子位智库 ·
              <a
                className="atlas-btn-link"
                href={atlasImg}
                target="_blank"
                rel="noopener noreferrer"
              >
                图谱详情
              </a>
            </p>
          </>
        ) : (
          <>
            <h1>🏆 百大应用榜单</h1>
            <p>
              最值得关注的100个AI · 数据来源：图灵的猫 ·{' '}
              <a
                href="https://www.turingscat.com/ai-top-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                原网站
              </a>
            </p>
          </>
        )}
        <div className="search-container">
          <input
            type="text"
            placeholder={
              activeTab === 'applications'
                ? '🔍 搜索你感兴趣的 AI 应用...'
                : '🔍 搜索 TOP100 应用...'
            }
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </header>
      {/* 图谱弹窗 */}
      {showAtlas && (
        <div className="atlas-modal" onClick={() => setShowAtlas(false)}>
          <div className="atlas-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={atlasImg} alt="AIGC 应用全景图谱详情" className="atlas-img atlas-img-large" />
            <button className="atlas-close" onClick={() => setShowAtlas(false)}>
              关闭
            </button>
          </div>
        </div>
      )}
      <main className="app-main">
        {activeTab === 'applications' ? (
          Object.keys(filteredData).length === 0 ? (
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
                  } else if (typeof subLevelContent === 'object' && subLevelContent !== null) {
                    return (
                      <div key={midCategory} className="mid-category-container">
                        <h3>{midCategory}</h3>
                        <div className="sections-wrapper">
                          {Object.entries(subLevelContent).map(
                            ([subCategory, finalLevelContent]) => {
                              if (Array.isArray(finalLevelContent)) {
                                return (
                                  <CategorySection
                                    key={subCategory}
                                    title={subCategory}
                                    applications={finalLevelContent}
                                  />
                                );
                              } else if (
                                typeof finalLevelContent === 'object' &&
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
                            }
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))
          )
        ) : (
          <Top100List items={top100Items} searchTerm={searchTerm} />
        )}
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} 中国 AIGC 应用全景图谱 · 持续更新中</p>
      </footer>
    </div>
  );
}

export default App;

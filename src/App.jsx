import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import CategorySection from './components/CategorySection';
import appData from './data/applications.json';
import Top100List from './components/Top100List';
import top100DataRaw from './data/top100.json';
import MvpTop50List from './components/MvpTop50List';
import mvpTop50Data from './data/2025AI-MVP-Top50.json';
import CompanyTop50List from './components/CompanyTop50List';
import companyTop50Data from './data/2025AI-Company-Top50.json';
import AI100RankingList from './components/AI100RankingList';
import ai100RankingData from './data/ai_100_ranking_2025_h1.json';
import CreativeAI100List from './components/CreativeAI100List';
import creativeAI100Data from './data/creative_ai_100.json';
import AICodingAppsList from './components/AICodingAppsList';
import aiCodingAppsData from './data/ai_coding_apps_complete.json';
import atlasImg from './data/atlas.jpg';
import './styles/App.css';

function flattenApplicationSections(data) {
  const sections = [];

  Object.entries(data).forEach(([topCategory, midLevelContent]) => {
    Object.entries(midLevelContent).forEach(([midCategory, subLevelContent]) => {
      if (Array.isArray(subLevelContent)) {
        sections.push({
          title: midCategory,
          metaPath: [topCategory],
          applications: subLevelContent,
        });
        return;
      }

      if (typeof subLevelContent !== 'object' || subLevelContent === null) {
        return;
      }

      Object.entries(subLevelContent).forEach(([subCategory, finalLevelContent]) => {
        if (Array.isArray(finalLevelContent)) {
          sections.push({
            title: subCategory,
            metaPath: [topCategory, midCategory],
            applications: finalLevelContent,
          });
          return;
        }

        if (typeof finalLevelContent !== 'object' || finalLevelContent === null) {
          return;
        }

        Object.entries(finalLevelContent).forEach(([finalCategory, applications]) => {
          sections.push({
            title: finalCategory,
            metaPath: [topCategory, midCategory, subCategory],
            applications,
          });
        });
      });
    });
  });

  return sections;
}

function AppContent() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAtlas, setShowAtlas] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 切换 body class
  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 560);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const mvpTop50Items = React.useMemo(() => {
    return mvpTop50Data || [];
  }, []);

  const companyTop50Items = React.useMemo(() => {
    return companyTop50Data || [];
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

  const applicationSections = useMemo(
    () => flattenApplicationSections(filteredData),
    [filteredData]
  );

  return (
    <div className="app-container">
      {/* Tab Bar 置于页面最顶部 */}
      <div className="tab-bar-row">
        <div className="tab-bar">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
            应用全景
          </NavLink>
          <NavLink to="/top100" className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
            TOP100 榜单
          </NavLink>
          <NavLink to="/mvp-top50" className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
            MVP Top50
          </NavLink>
          <NavLink
            to="/company-top50"
            className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
          >
            Company Top50
          </NavLink>
          <NavLink
            to="/ai100-ranking"
            className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
          >
            AI 100 旗舰榜
          </NavLink>
          <NavLink
            to="/creative-ai-100"
            className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
          >
            创意AI 100
          </NavLink>
          <NavLink
            to="/ai-coding-apps"
            className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
          >
            AI编程应用
          </NavLink>
        </div>
        <div className="theme-toggle-wrapper">
          <button className="theme-toggle-btn" onClick={toggleTheme} title="切换明暗模式">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* Header 根据标签页切换内容 */}
      <header className="app-header">
        {location.pathname === '/' ? (
          <>
            <div className="atlas-btn-link-wrapper"></div>
            <h1>2025中国 AIGC 应用全景图谱</h1>
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
        ) : location.pathname === '/top100' ? (
          <>
            <h1>百大应用榜单</h1>
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
        ) : location.pathname === '/mvp-top50' ? (
          <>
            <h1>2025 AI MVP Top 50</h1>
            <p>最具价值的50个AI产品</p>
          </>
        ) : location.pathname === '/company-top50' ? (
          <>
            <h1>2025 AI Company Top 50</h1>
            <p>最具影响力的50家AI公司</p>
          </>
        ) : location.pathname === '/ai100-ranking' ? (
          <>
            <h1>AI 100 2025 H1 旗舰产品榜</h1>
            <p>
              2025上半年最具代表性的AI产品榜单 · 数据来源：量子位 insights ·{' '}
              <a href="https://www.qbitai.com/" target="_blank" rel="noopener noreferrer">
                量子位官网
              </a>
            </p>
          </>
        ) : location.pathname === '/creative-ai-100' ? (
          <>
            <h1>创意AI 100</h1>
            <p>最具创意价值的100个AI应用 · 涵盖创作工具、设计平台、生产力助手等多个领域</p>
          </>
        ) : location.pathname === '/ai-coding-apps' ? (
          <>
            <h1>AI编程应用榜单</h1>
            <p>全面收录AI编程工具 · 涵盖助手类、代理类、Copilot、低代码平台等多个分类</p>
          </>
        ) : (
          <>
            <h1>AI 应用榜单</h1>
            <p>探索最新的AI应用</p>
          </>
        )}
        <div className="search-container">
          <input
            type="text"
            placeholder={
              location.pathname === '/'
                ? '搜索你感兴趣的 AI 应用...'
                : location.pathname === '/top100'
                ? '搜索 TOP100 应用...'
                : location.pathname === '/mvp-top50'
                ? '搜索 MVP Top50 应用...'
                : location.pathname === '/company-top50'
                ? '搜索 Company Top50 应用...'
                : location.pathname === '/ai100-ranking'
                ? '搜索 AI 100 旗舰榜应用...'
                : location.pathname === '/creative-ai-100'
                ? '搜索创意AI 100应用...'
                : location.pathname === '/ai-coding-apps'
                ? '搜索AI编程应用...'
                : '搜索应用...'
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
        <Routes>
          <Route
            path="/"
            element={
              applicationSections.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">🔍</div>
                    <h3>未找到相关应用</h3>
                    <p>尝试使用其他关键词搜索</p>
                  </div>
                </div>
              ) : (
                <div className="atlas-section-list">
                  {applicationSections.map(({ title, metaPath, applications }) => (
                    <CategorySection
                      key={`${metaPath.join('/')}/${title}`}
                      title={title}
                      metaPath={metaPath}
                      applications={applications}
                    />
                  ))}
                </div>
              )
            }
          />
          <Route
            path="/top100"
            element={<Top100List items={top100Items} searchTerm={searchTerm} />}
          />
          <Route path="/mvp-top50" element={<MvpTop50List items={mvpTop50Items} />} />
          <Route path="/company-top50" element={<CompanyTop50List items={companyTop50Items} />} />
          <Route
            path="/ai100-ranking"
            element={<AI100RankingList data={ai100RankingData} searchTerm={searchTerm} />}
          />
          <Route
            path="/creative-ai-100"
            element={<CreativeAI100List data={creativeAI100Data} searchTerm={searchTerm} />}
          />
          <Route
            path="/ai-coding-apps"
            element={<AICodingAppsList data={aiCodingAppsData} searchTerm={searchTerm} />}
          />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} 中国 AIGC 应用全景图谱 · 持续更新中</p>
      </footer>
      <button
        type="button"
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="回到顶部"
        title="回到顶部"
      >
        ↑
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

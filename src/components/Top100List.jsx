import React from 'react';
import PropTypes from 'prop-types';

function Top100List({ items, searchTerm }) {
  // 搜索过滤
  const filteredItems = React.useMemo(() => {
    if (!searchTerm) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        (item.description && item.description.toLowerCase().includes(lower))
    );
  }, [items, searchTerm]);

  // 按 primaryCategory.name 分类分组
  const grouped = React.useMemo(() => {
    const map = {};
    filteredItems.forEach((item) => {
      const cat = item.primaryCategory?.name || '未分类';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });
    return map;
  }, [filteredItems]);

  if (!filteredItems.length) {
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
    <div className="top100-group-list">
      {Object.entries(grouped).map(([cat, apps]) => (
        <div className="top100-category-group" key={cat}>
          <h2 className="top100-category-title">{cat}</h2>
          <div className="top100-list">
            {apps.map((item, idx) => (
              <a
                className="top100-card"
                key={item.id}
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={item.name}
              >
                <div className="top100-rank">#{idx + 1}</div>
                <div className="logo-container">
                  <img src={item.logo} alt={item.name} className="application-logo" />
                </div>
                <div className="top100-card-content">
                  <div className="application-name">{item.name}</div>
                  <div className="top100-meta">
                    <span>{item.primaryCategory?.name}</span>
                    <span>推荐指数: {item.recommendationIndex ?? '-'}</span>
                    <span>{item.paymentModel}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

Top100List.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      websiteUrl: PropTypes.string,
      logo: PropTypes.string,
      description: PropTypes.string,
      primaryCategory: PropTypes.object,
      paymentModel: PropTypes.string,
      recommendationIndex: PropTypes.number,
    })
  ).isRequired,
  searchTerm: PropTypes.string,
};

export default Top100List;

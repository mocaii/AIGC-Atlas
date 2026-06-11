import React from "react";
import PropTypes from "prop-types";
import ApplicationCard from "./ApplicationCard";

function CategorySection({ title, metaPath, applications }) {
  if (!applications || applications.length === 0) {
    return null;
  }

  return (
    <div className="category-section">
      <div className="category-header">
        <div className="category-heading">
          {metaPath.length > 0 && <div className="category-path">{metaPath.join(' / ')}</div>}
          <h3 className="category-title">{title}</h3>
        </div>
        <span className="app-count">{applications.length}</span>
      </div>
      <div className="applications-grid">
        {applications.map((app, index) => (
          <ApplicationCard
            key={index}
            name={app.name}
            logo={app.iconUrl}
            url={app.url}
            description={app.description}
          />
        ))}
      </div>
    </div>
  );
}

CategorySection.propTypes = {
  title: PropTypes.string.isRequired,
  metaPath: PropTypes.arrayOf(PropTypes.string),
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      logo: PropTypes.string,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

CategorySection.defaultProps = {
  metaPath: [],
};

export default CategorySection;

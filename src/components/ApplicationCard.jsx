import React, { useState } from "react";
import PropTypes from "prop-types";

function ApplicationCard({ name, url, logo, description }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="application-card"
      title={description || name}
    >
      <div className="logo-container">
        {imageLoading && !imageError && (
          <div className="logo-skeleton">
            <div className="skeleton-animation"></div>
          </div>
        )}
        {!imageError ? (
          <img 
            src={logo} 
            alt={`${name} Logo`} 
            className="application-logo"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        ) : (
          <div className="logo-fallback">
            {getInitials(name)}
          </div>
        )}
      </div>
      <span className="application-name">{name}</span>
    </a>
  );
}

ApplicationCard.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  logo: PropTypes.string,
  description: PropTypes.string,
};

ApplicationCard.defaultProps = {
  logo: '',
  description: '',
};

export default ApplicationCard;

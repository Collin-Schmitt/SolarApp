import React from 'react';
import './Banner.css'; // Optional: if you want to style the banner

const Banner = ({ description }) => {
  return (
    <div className="banner">
      <h2>{description}</h2>
    </div>
  );
};

export default Banner;

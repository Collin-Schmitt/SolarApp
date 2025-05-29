import React from 'react';
import './Stations.css'; 

const Stations = ({ stations }) => {
  return (
    <div className="stations">
      {stations.map((station, index) => (
        <div key={index} className="station">
          <h3>{station.id}</h3>
          <p>Distance: {station.distance} meters</p>
          <p>Latitude: {station.latitude}</p>
          <p>Longitude: {station.longitude}</p>
        </div>
      ))}
    </div>
  );
};
export default Stations;

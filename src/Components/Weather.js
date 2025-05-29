import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Weather.css'; 
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useHistoricalWeatherData, calculateDaylightHours } from './useHistoricalWeatherData'; // Import the custom hook and calculateDaylightHours
import Banner from './Banner';
import { auth } from '../firebaseConfig'; 
import { signOut } from 'firebase/auth';
import Stations from './Stations';

const Weather = () => {
  const [location, setLocation] = useState(''); // State to store user's location (latitude and longitude)
  const [currentWeatherData, setCurrentWeatherData] = useState(null); // State to store current weather data
  const [useGeolocation, setUseGeolocation] = useState(true); // State to toggle between using geolocation or manual input
  const [manualLocation, setManualLocation] = useState(''); // State to store manual location input
  const [showModal, setShowModal] = useState(false);
  const [timeRange, setTimeRange] = useState('year'); // Add state for time range
  const historicalWeatherData = useHistoricalWeatherData(location, timeRange); // Use the custom hook
  const [stations, setStations] = useState([]);

  const API_KEY = 'CHPNN3CGQ5XSCXHLSMZ352LRT';

  useEffect(() => {
    if (useGeolocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting geolocation:', error); 
        }
      );
    }
  }, [useGeolocation]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`
        );
        console.log('API Response:', response);



        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} - ${response.statusText}\n${errorText}`);
        }
  

        const data = await response.json();
        console.log('Current Weather Data:', data);
        setCurrentWeatherData(data);

        const stationsData = Object.values(data.stations).sort((a, b) => a.distance - b.distance).slice(0, 5);
        setStations(stationsData);
      } catch (error) {
        console.error('Failed to fetch current weather data:', error);
      }

    };

    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const handleManualLocationSubmit = (e) => {
    e.preventDefault();
    setLocation(manualLocation);
    setUseGeolocation(false);
  };

  const handleGeolocationChange = () => {
    setUseGeolocation(true);
    setLocation('');
  };

  const handleShowModal = (range) => {
    setTimeRange(range);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

    //function for taking the celsius from API call and converting to Fahrenheit
  const convertToFahrenHeit = (celsius) => {
    return (celsius * 9/5) + 32;
  }

    //logout function 
    const handleLogout = async () => {
      try {
        await signOut(auth);
        // Optionally, redirect the user to the login page after logout
        window.location.href = '/';
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
  return (
    
    <div className="weather-container">
    <button onClick={handleLogout}>Logout</button>
      <h1>Weather Information</h1>
      <div className="button-menu">
        <button onClick={() => handleShowModal('year')}>Year-to-Date</button>
        <button onClick={() => handleShowModal('month')}>Month-to-Date</button>
        <button onClick={() => handleShowModal('week')}>Week-to-Date</button>
      </div>
      <div>
        <label>
          <input
            type="radio"
            checked={useGeolocation}
            onChange={handleGeolocationChange}
          />
          Use Geolocation
        </label>
        <label>
          <input
            type="radio"
            checked={!useGeolocation}
            onChange={() => setUseGeolocation(false)}
          />
          Enter Coordinates Manually
        </label>
      </div>

      {!useGeolocation && (
        <form className="weather-form" onSubmit={handleManualLocationSubmit}>
          <input
            type="text"
            placeholder="Enter Location"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
          />
          <button type="submit">Get Weather</button>
        </form>
      )}

      {currentWeatherData && currentWeatherData.currentConditions && (
        <div className="weather-info">
          <Banner description={currentWeatherData.description} />
          <h2>Current Weather</h2>
          <p>Temperature: {currentWeatherData.currentConditions.temp}°C / {convertToFahrenHeit(currentWeatherData.currentConditions.temp)} °F</p>
          <p>Solar Radiation: {currentWeatherData.days[0].solarradiation} W/m²</p>
          <p>Solar Energy: {currentWeatherData.days[0].solarenergy} MJ/m²</p>
          <p>UV Index: {currentWeatherData.days[0].uvindex}</p>
          <p>
            Daylight Hours: {calculateDaylightHours(currentWeatherData.days[0].sunrise, currentWeatherData.days[0].sunset)} hours
          </p>
          <h2>Nearby Weather Stations</h2>
          <Stations stations={stations} />
        </div>
      )}

      {showModal && (
        <Modal show={showModal} handleClose={handleCloseModal}>
          <div className="modal-content">
            <h2>{`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}-to-Date Weather Data`}</h2>
            {historicalWeatherData.length > 0 && (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={historicalWeatherData}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="datetime" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temp" stroke="#8884d8" />
                  <Line type="monotone" dataKey="daylightHours" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="solarradiation" stroke="#ffc658" />
                  <Line type="monotone" dataKey="solarenergy" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Weather;

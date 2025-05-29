import { useState, useEffect } from 'react';

const API_KEY = 'D6BH7WPB6G533U8M2L453B37J';

//function to calculate daylight hours since it was not a specific value in API
const calculateDaylightHours = (sunrise, sunset) => {
  const sunriseDate = new Date(`1970-01-01T${sunrise}Z`);
  const sunsetDate = new Date(`1970-01-01T${sunset}Z`);
  const daylightMilliseconds = sunsetDate - sunriseDate;
  const daylightHours = daylightMilliseconds / (1000 * 60 * 60);
  return daylightHours.toFixed(2);
};

const useHistoricalWeatherData = (location, range) => {
  const [historicalWeatherData, setHistoricalWeatherData] = useState([]);

  useEffect(() => {
    const fetchHistoricalWeatherData = async () => {
      try {
        const endDate = new Date();
        let startDate;
        switch (range) { //range is set when you call handleshowmodal function
          case 'year':
            startDate = new Date(endDate);
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
          case 'month':
            startDate = new Date(endDate);
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case 'week':
            startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 7);
            break;
          default:
            startDate = new Date(endDate);
            startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
        const interval = Math.ceil(totalDays / 9);

        const dataPromises = []; //array that will hold the promises returned by the fetch api calls
        for (let i = 0; i < 9; i++) {
          const date = new Date(startDate); //creating date object with same date and time as startdate
          date.setDate(date.getDate() + i * interval); //as i increasess, the month increases by interval days
          const formattedDate = date.toISOString().split('T')[0]; //formatting the date to ISO string (2022-01-01)
          dataPromises.push( //adds the promise to the dataPromises array
            fetch(
              `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${formattedDate}?unitGroup=metric&key=${API_KEY}&contentType=json`
            ).then((res) => res.json())
          );
        }
            // Fetch data for today's date for last point in graphs
        const todayFormatted = endDate.toISOString().split('T')[0];
        dataPromises.push(
          fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${todayFormatted}?unitGroup=metric&key=${API_KEY}&contentType=json`
          ).then((res) => res.json())
        );
        //take the raw data from API for different dates, extract and transform relevant daily weather data, and store it to be able to display in chart
        const allData = await Promise.all(dataPromises);
        const combinedData = allData.flatMap((data) => data.days).map((day) => ({ //flatmap is a method that maps each element of the array to a new array and then "flattens" the result into one single array
          datetime: day.datetime,
          temp: day.temp,
          solarradiation: day.solarradiation,
          solarenergy: day.solarenergy,
          daylightHours: calculateDaylightHours(day.sunrise, day.sunset),
        }));

        console.log(`Historical Weather Data (${range}):`, combinedData);

        setHistoricalWeatherData(combinedData);
      } catch (error) {
        console.error(`Failed to fetch historical weather data (${range}):`, error);
      }
    };

    if (location) { //if we get user's location, automatically get historical data ready
      fetchHistoricalWeatherData();
    }
  }, [location, range]);

  return historicalWeatherData;
};

export { useHistoricalWeatherData, calculateDaylightHours };

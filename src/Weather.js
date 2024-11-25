import React, { useState } from "react";
import axios from "axios";
import "./Weather.css";
 
const Weather = () => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
 
  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      setWeather(response.data);
    } catch (err) {
      setError("Unable to fetch weather data. Please check the city name.");
    } finally {
      setLoading(false);
    }
  };
 
  const fetchCitySuggestions = async (query) => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
      );
      setSuggestions(response.data);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
    }
  };
 
  const handleCityChange = (e) => {
    const input = e.target.value;
    setCity(input);
    fetchCitySuggestions(input);
  };
 
  const handleSuggestionClick = (suggestion) => {
    setCity(`${suggestion.name}, ${suggestion.country}`);
    setSuggestions([]);
    fetchWeather();
  };
 
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() === "") {
      setError("City name cannot be empty.");
      return;
    }
    fetchWeather();
  };
 
  return (
<div className="weather-container">
<div className="weather-card">
<h1 className="title">Weather App</h1>
<form onSubmit={handleSearch} className="search-form">
<div className="autocomplete-container">
<input
              type="text"
              className="search-input"
              placeholder="Enter city"
              value={city}
              onChange={handleCityChange}
            />
            {suggestions.length > 0 && (
<ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
<li
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
>
                    {suggestion.name}, {suggestion.country}
</li>
                ))}
</ul>
            )}
</div>
<button type="submit" className="search-button" disabled={loading}>
            {loading ? "Loading..." : "Search"}
</button>
</form>
        {error && <p className="error-message">{error}</p>}
        {weather && !loading && (
<div className="weather-info">
<h2>{weather.name}</h2>
<p>🌡️ Temperature: {weather.main.temp}°C</p>
<p>🌥️ Weather: {weather.weather[0].description}</p>
<p>💧 Humidity: {weather.main.humidity}%</p>
<p>💨 Wind Speed: {weather.wind.speed} m/s</p>
</div>
        )}
</div>
</div>
  );
};
 
export default Weather;
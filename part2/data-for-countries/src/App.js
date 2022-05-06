import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [capitalWeather, setCapitalWeather] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const countryHook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        const searchResult = response.data.filter(country => country.name.common.toLowerCase().includes(searchValue));

        setCountries(searchResult);
      });
  }

  const weatherHook = () => {
    const API_KEY = process.env.REACT_APP_OPEN_WEATHER_KEY;

    if (countries.length) {
      const country = countries[0];

      if (countries.length === 1 && country.capitalInfo && country.capitalInfo.latlng && country.capitalInfo.latlng.length) {
        const latLng = countries[0].capitalInfo.latlng;
        const [lat, lng] = latLng;

        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lng}&appid=${API_KEY}`)
          .then(response => {
            setCapitalWeather(response.data);
          });
      }
    }
  }

  useEffect(countryHook, [searchValue]);
  useEffect(weatherHook, [countries]);

  const handleSearchChange = (event) => {
    const formattedSearchValue = event.target.value.toLowerCase();

    setSearchValue(formattedSearchValue);
  }

  const displayCountries = () => {
    let result = <p>Too many matches, specify another filter</p>;

    if (countries.length === 1) {
      const country = countries[0];
      const languagesList = Object.values(country.languages);

      result = (
        <div>
          <h1>{country.name.common}</h1>
          <div>
            <p>capital {country.capital[0]}</p>
            <p>area {country.area}</p>
          </div>

          <div>
            <h2>languages:</h2>
            <ul>
              {languagesList.map(language => (
                <li key={language}>{language}</li>
              ))}
            </ul>
          </div>
          <img src={country.flags.png} />
        </div>
      );
    } else if (countries.length <= 10) {
      result = countries.map(country =>
        <p key={country.name.common}>{country.name.common}</p>
      );
    }

    return result;
  }

  const displayWeather = () => {
    if (countries.length === 1 && capitalWeather) {
      const weatherIcon = capitalWeather?.weather?.[0].icon ?? '';
      const weatherIconSrc = weatherIcon ? `http://openweathermap.org/img/wn/${weatherIcon}@2x.png` : '';

      return (
        <div>
          <h2>Weather in {countries[0].capital[0]}</h2>
          <div>
            <p>temperature in {capitalWeather.main.temp} Celsius</p>
            {weatherIconSrc && 
              <img src={weatherIconSrc} />
            }
            <p>wind {capitalWeather.wind.speed}</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      find countries <input value={searchValue} onChange={handleSearchChange} />
      <div>
        {displayCountries()}
        {displayWeather()}
      </div>
    </div>
  );
}

export default App;

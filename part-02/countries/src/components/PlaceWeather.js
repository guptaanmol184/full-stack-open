import axios from 'axios'
import { useEffect, useState } from 'react'

const PlaceWeather = ({ placeName }) => {

  const [weather, setWeather] = useState(null)
  const baseUrl = 'http://api.weatherstack.com/current?'

  useEffect(() => {
    axios
      .get(`${baseUrl}access_key=${process.env.REACT_APP_WEATHERSTACK_API_KEY}&query=${placeName}`)
      .then(response => setWeather(response.data))
  }, [placeName])


  return (
    weather === null ?
      <p>Fetching weather data...</p> :
      <div>
        <p>Temperature: {weather.current.temperature}</p>
        {
          weather.current.weather_icons.map(icon_url =>
            <img alt={icon_url} src={icon_url} />)
        }
        <p>Wind Speed: {weather.current.wind_speed}, direction: {weather.current.wind_dir}</p>
      </div>
  )
}

export default PlaceWeather

import Forecast from './Forecast';
import Alerts from './Alerts';
import Legend from './Legend';

import aqiusData from './data/aqius.json';
import weatherData from './data/weather.json';

const FORECAST_AMOUNT = 10;

function getAqius(){
  return aqiusData.data.current.pollution.aqius;
}

function getLocalEpoch(){
  return weatherData.location.localtime_epoch;
}

function getForecastHours(){
  return weatherData.forecast.forecastday[0].hour;
}

function getFilteredForecast(){
  return getForecastHours()
    .filter((hour_fc) => hour_fc.time_epoch > getLocalEpoch()) //Ignore the forecast for the past
    .slice(0, FORECAST_AMOUNT); //Keep only the next x hours
}

function getTomorrowForecastHour(index){
  return weatherData.forecast.forecastday[1].hour[index];
}

function getForecast(){
  const filtered_forecast = getFilteredForecast();

  //Enriching forecast until we reach FORECAST_AMOUNT 
  let index = -1; while(filtered_forecast.length < FORECAST_AMOUNT)
    filtered_forecast.push(getTomorrowForecastHour(index++))

  return filtered_forecast;
}

function getPrecEmoji(forecast){
  const chancesOfRain = forecast.reduce((acc, hour_fc) => acc + hour_fc.chance_of_rain, 0);
  const chancesOfSnow = forecast.reduce((acc, hour_fc) => acc + hour_fc.chance_of_snow, 0);
  return chancesOfSnow > chancesOfRain ? "🌨️" : "🌧️";
}

function App() {
  const aqius = getAqius();
  const forecast = getForecast(weatherData);
  return (
    <div className="App" >
      <Alerts aqius={aqius} forecast={forecast} precEmoji={getPrecEmoji(forecast)}/>
      <Forecast forecast={forecast} precEmoji={getPrecEmoji(forecast)}/>
      <Legend />
    </div>
  );
}

export default App;

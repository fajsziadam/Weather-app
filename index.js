import { WeatherDataFetcher } from "./WeatherDataFetcher.js";

const apiKey = YOUR_API_KEY;

/**
 * WeatherApp class responsible for querying and displaying weather data.
 */
class WeatherApp{

    /**
     * Initialize the constructor of the class.
     * @param {string} defaultCity - The name of the default city used when starting the application.
     * @param {string} apiKey - The OpenWeather API key.
     */
    constructor(defaultCity = "Baja", apiKey){
        this.currentCity = defaultCity;
        this.apiKey = apiKey;
        this.weatherDataFetcher = new WeatherDataFetcher(apiKey);
        this.weatherForm = document.querySelector(".weatherForm");
        this.informations = document.querySelector(".informations");

        this.init();
    }

    /**
     * Initialize the application:
     * - Sets up the city data display on page load
     * - Sets up the search event handler
     * - Starts the refresh cycle
     */
    init() {
        
        window.onload = async () => {
            await this.displayWeatherInfo(this.currentCity);
        };
        
        this.weatherForm.addEventListener("submit", async (event) =>{
                event.preventDefault();
                const cityInput = document.getElementById('cityInput').value.trim();
                if (!cityInput) {
                    this.displayError("Please enter a city");
                    return;
                }
                this.currentCity = cityInput;
                await this.displayWeatherInfo(this.currentCity);
                document.getElementById('cityInput').value = '';
        });

        this.startRefreshingWeather();
    }

    /**
     * Displays weather information for the given city.
     * @param {string} city - The name of the city.
     */
    async displayWeatherInfo(city){
        try{
        const coordinates = await this.weatherDataFetcher.getCoordinates(city);
        if (coordinates) {
            const weatherData  = await this.weatherDataFetcher.getWeather(coordinates.lat, coordinates.lon);
            if (weatherData) {
                console.log(weatherData.daily[0]);
                const dailyWeather = weatherData.daily[0];
                this.clearContent();

                const date = new Date(dailyWeather.dt * 1000).toLocaleDateString();
                const sunriseTime = new Date(dailyWeather.sunrise * 1000).toLocaleTimeString();
                const sunsetTime = new Date(dailyWeather.sunset * 1000).toLocaleTimeString();
                const moonriseTime = new Date(dailyWeather.moonrise * 1000).toLocaleTimeString();
                const moonsetTime = new Date(dailyWeather.moonset * 1000).toLocaleTimeString();
                const weatherDetails = `
                            <h2>Weather in ${coordinates.name}</h2>
                            <p><strong>Date:</strong> ${date}</p>
                            <p><strong>Sunrise:</strong> ${sunriseTime}</p>
                            <p><strong>Sunset:</strong> ${sunsetTime}</p>
                            <p><strong>Moonrise:</strong> ${moonriseTime}</p>
                            <p><strong>Moonset:</strong> ${moonsetTime}</p>
                            <p><strong>Moon phase:</strong> ${dailyWeather.moon_phase}</p>
                            <p><strong>Summary:</strong> ${dailyWeather.summary || "No summary available"}</p><br>
                            <p><strong>Temperature:</strong><br>
                                    <strong>Day:</strong> ${dailyWeather.temp.day}°C <br>
                                    <strong>Min:</strong> ${dailyWeather.temp.min}°C <br>
                                    <strong>Max:</strong> ${dailyWeather.temp.max}°C <br>
                                    <strong>Night:</strong> ${dailyWeather.temp.night}°C <br>
                                    <strong>Evening:</strong> ${dailyWeather.temp.eve}°C <br>
                                    <strong>Morning:</strong> ${dailyWeather.temp.morn}°C  <br> <br></p>
                            <p><strong>Feels like:</strong> <br>
                                <strong>Morning:</strong> ${dailyWeather.feels_like.morn}°C <br>
                                    <strong>Day:</strong> ${dailyWeather.feels_like.day}°C <br>
                                    <strong>Evening:</strong> ${dailyWeather.feels_like.eve}°C <br>
                                    <strong>Night:</strong> ${dailyWeather.feels_like.night}°C <br> <br></p>
                            <p><strong>Pressure:</strong> ${dailyWeather.pressure}hPa</p>
                            <p><strong>Humidity:</strong> ${dailyWeather.humidity}%</p>
                            <p><strong>Atmospheric temperature:</strong> ${dailyWeather.dew_point}°C</p>
                            <p><strong>Wind Speed:</strong> ${(dailyWeather.wind_speed * 3.6).toFixed(2)}km/h</p>
                            <p><strong>Wind Gust:</strong> ${(dailyWeather.wind_gust * 3.6).toFixed(2)}km/h</p>
                            <p><strong>Wind degrees:</strong> ${(dailyWeather.wind_deg )}°</p>
                            <p><strong>Cloudiness:</strong> ${dailyWeather.clouds}%</p>
                            <p><strong>UV Index:</strong> ${dailyWeather.uvi}</p>
                            <p><strong>Probability of precipitation:</strong> ${dailyWeather.pop}</p>
                            ${dailyWeather.rain ? `<p><strong>Rain:</strong> ${dailyWeather.rain}mm</p>` : ''}
                            ${dailyWeather.snow ? `<p><strong>Snow:</strong> ${dailyWeather.snow}mm</p>` : ''}
                            <p><strong>Weather ID:</strong> ${dailyWeather.weather[0].id}</p>
                            <p><strong>Weather main:</strong> ${dailyWeather.weather[0].main}</p>
                            <p><strong>Weather description:</strong> ${dailyWeather.weather[0].description}</p>
                            <p><strong>Weather icon:</strong> ${dailyWeather.weather[0].icon}</p>
                            <img src="http://openweathermap.org/img/wn/${dailyWeather.weather[0].icon}.png" alt="Weather icon" width="150px" height="150px">
                        `;
                        this.informations.innerHTML = weatherDetails;
                        this.informations.style.display = "flex";
            } 
        }
        }catch(error){
            this.displayError(error.message);
        }
    }

    /**
     * Displays an error message to the user.
     * @param {string} message -  The error message.
     */
    displayError(message){
        const errorDisplay = document.createElement("p");
        errorDisplay.classList.add("errorDisplay")
        errorDisplay.textContent = message;

        this.clearContent();
        this.informations.style.display = "flex";
        this.informations.appendChild(errorDisplay);    
    }

    /**
     * Clears the informational content.
     */
    clearContent() {
        this.informations.textContent = "";
    }

    /**
     * Starts the weather refresh cycle.
     */
    startRefreshingWeather() {
        const REFRESH_INTERVAL_MS = 300000; // 5 minutes in milliseconds
        setInterval(() => {
            this.displayWeatherInfo(this.currentCity);
        }, REFRESH_INTERVAL_MS);
    }
}

//Instantiate the application with the default city and API key
const weatherApp = new WeatherApp("Baja", apiKey);
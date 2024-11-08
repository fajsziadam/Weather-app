export class WeatherDataFetcher {

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
         * Queries the coordinates of the provided city from the OpenWeather API.
         * @param {string} city - The name of the city.
         * @returns - The coordinates of the city, or null if an error occurred.
         */
    async getCoordinates(city) {
        try{      
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},HUlimit=1&appid=${this.apiKey}`)
            if(!response.ok){
                throw new Error("Please enter a valid city");
            }
            const data = await response.json();

            if (data.length === 0) {
                throw new Error("City not found, Please enter a valid city");
            }
            return {
                lat: data[0].lat,
                lon: data[0].lon,
                name: data[0].name
            }
        }
        catch(error){
            throw error;
        }
    }

    /**
     * Queries the weather data for the city based on the provided coordinates from the OpenWeather API.
     * @param {number} lat - The latitude of the city.
     * @param {number} lon - The longitude of the city.
     * @returns - The weather data for the city, or null if an error occurred.
     */
    async getWeather(lat, lon) { 
        try{
            const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`);
            if(!response.ok){
                throw new Error("Could not fetch data from the API");
            }
            return await response.json();
        } catch(error){
            throw error;
        }
    }
}
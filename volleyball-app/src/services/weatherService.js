const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export const weatherService = {
  async searchLocations(query) {
    try {
      const response = await fetch(
        `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=5&language=es&format=json`
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  },

  async getWeather(latitude, longitude, date) {
    try {
      const response = await fetch(
        `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&timezone=auto`
      );
      const data = await response.json();
      
      const matchDate = new Date(date);
      const hourIndex = matchDate.getHours();
      const dateString = matchDate.toISOString().split('T')[0];
      
      const temperatureIndex = data.hourly.time.findIndex(time => time.startsWith(dateString));
      
      if (temperatureIndex === -1) {
        throw new Error('Weather data not available for the specified date');
      }

      return {
        temperature: data.hourly.temperature_2m[temperatureIndex + hourIndex],
        weatherCode: data.hourly.weathercode[temperatureIndex + hourIndex]
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }
};
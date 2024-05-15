import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ApiKey = process.env.API_KEY;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Weather route
app.post('/weather', async (req, res) => {
    const cityName = req.body.city;
    
    try {
        // Get coordinates from the city name
        const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
            params: {
                q: cityName,
                appid: ApiKey
            }
        });

        if (geoResponse.data.length === 0) {
            throw new Error('City not found');
        }

        // Extract latitude and longitude from the response
        const lat = geoResponse.data[0].lat;
        const lon = geoResponse.data[0].lon;

        // Get weather data using the coordinates
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                lat: lat,
                lon: lon,
                appid: ApiKey,
                units: 'metric'
            }
        });

        const weatherData = weatherResponse.data;

        // Get UV index data
        const uvResponse = await axios.get(`https://api.openweathermap.org/data/2.5/uvi`, {
            params: {
                lat: lat,
                lon: lon,
                appid: ApiKey
            }
        });

        const uvData = uvResponse.data;

        // Get forecast data
        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
            params: {
                lat: lat,
                lon: lon,
                appid: ApiKey,
                units: 'metric'
            }
        });

        const forecastData = forecastResponse.data;

        // Render the index view with weather, UV, and forecast data
        res.render('index', {
            weather: weatherData,
            city: cityName,
            uv: uvData,
            forecast: forecastData
        });

    } catch (error) {
        console.error(error);
        // Render the error view if there's an issue
        res.render('error', { error: 'Unable to retrieve weather data.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



// Event listener for form submission
$('#search-form').on('submit', function (event) {
    event.preventDefault();

    const searchInputEl = $('#search-input');
    let city = searchInputEl.val().trim();
    try {
        if (city !== '') {
           processForm(city)
           searchInputEl.text("") 
        } else {
            console.log('Please enter a valid city name.');
        }
    } catch (error) {
        // Handle error
        console.error(error);
    }
});

processForm = async(city) => {
    //console.log(city);
  
    const APIkey = "5b2375941e9dbbfe2c656322b8b09720"
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&limit=5&appid=${APIkey}`;
    const location =  await getApiData(apiUrl);
 
    const {lon, lat} = location.coord;
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&limit=5&appid=${APIkey}`
    const forecast =  await getApiData(apiUrl);
        
   // console.log(forecast)
   displayWeather(forecast)
  
}

async function getApiData(apiUrl) {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        return data; // Return the data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Throw the error to be caught by the calling code
    }
}

// Function to display 5-day weather forecast
function displayWeather(forecastData) {
    const {list} = forecastData
    weatherData = list.slice(0, 5)
    console.log(weatherData)

    // Clear previous weather forecast 
    const forecastEl = $('#forecast');
    forecastEl.empty();

    // Extract and display forecast information
    weatherData.forEach((item) => {
        const mydate = new Date(item.dt * 1000); // Convert timestamp to Date object
        const dateString = mydate.toDateString();

        const temperature = item.main.temp;
        const weatherIcon = item.weather[0].icon;
        const wind = item.wind.speed;
        const humidity = item.main.humidity;

        // Create a card for each day
        // const card = $('<div>').addClass('card','col-2', 'm-1', 'bg-primary', 'text-white');
        const card = $("<div>").addClass('card');

        card.html(cardTemplate(dateString, weatherIcon, temperature, wind, humidity));

        forecastEl.append(card);
    });
   
}

cardTemplate = (dateString, weatherIcon, temp, wind, humidity) => {
   return `<div class="card-body">
        <h6 class="card-title">${dateString}</h6>
        <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
        <p class="card-text">
            Temperature: ${temp} °C <br>
            Wind Speed: ${wind}  KPH<br>
            Humidity: ${humidity} <br>
        </p>
    </div>`
}









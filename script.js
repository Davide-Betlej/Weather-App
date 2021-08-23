const API_KEY = 'ebd6e2ef4de24d49f11cbb59647636e0';

const form = document.querySelector('form')
const submitButton = document.getElementById('submitButton')
const tempButton = document.querySelector('.tempButton')
const degrees = document.querySelector('.degrees')
const feelsLike = document.querySelector('.feels-like')
const loader = document.querySelector('#loading')
const errorMsg = document.querySelector('.errorMsg')

form.addEventListener('submit', handleSubmit)
submitButton.addEventListener('click', handleSubmit)
tempButton.addEventListener('click', changeTemp);

function changeTemp() {
    let mainTemp = degrees.textContent.split(' ')
    let mainValue = mainTemp[0]
    let mainUnit = mainTemp[1]

    let feelsTemp = feelsLike.textContent.split(' ')
    let feelsValue = feelsTemp[2]
    let feelsUnit = feelsTemp[3]
    if (mainUnit === "°C" && feelsUnit === "°C") {
        degrees.textContent = Math.round(mainValue * 9 / 5 + 32) + ' °F';
        feelsLike.textContent = 'Feels Like: ' + Math.round(feelsValue * 9 / 5 + 32) + ' °F';
    } else if (mainUnit === "°F") {
        degrees.textContent = Math.round((mainValue - 32) * 5 / 9) + ' °C';
        feelsLike.textContent = 'Feels Like: ' + Math.round((feelsValue - 32) * 5 / 9) + ' °C';
    }
}



function handleSubmit (e) {
    e.preventDefault();
    inputFetch();
    hideError();
}

function inputFetch() {
    const input = document.querySelector('input[type="text"]')
    const userInput = input.value;
    fetchLocation(userInput)
}

function showError () {
    errorMsg.classList.add("display");
}

function hideError() {
    errorMsg.classList.remove("display");
}

function displayLoading() {
    loader.classList.add("display");
}

function hideLoading() {
    loader.classList.remove("display");
}

async function fetchLocation(location) {
    try {
        displayLoading();
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`,
        {mode: 'cors'}
        );
        const data = await response.json();
        console.log(data)
        const processedData = processFetch(data);
        hideLoading();
        displayData(processedData);
        reset();
        } catch (error) {
            console.log(error)
            hideLoading();
            showError();
        }
    }
    
function processFetch (data) {
    const myData = {
        location: data.name,
        country: data.sys.country,
        temperature: Math.round (data.main.temp),
        weather: data.weather[0].main,
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind: data.wind.speed
    }
    console.log(myData)
    return myData;
    }

function displayData(processedData) {
    const mySelectors = {
        weather: document.querySelector('.condition'),
        location: document.getElementById('location'),
        temperature: document.querySelector('.degrees'),
        feelsLike: document.querySelector('.feels-like'),
        humidity: document.querySelector('.humidity'),
        wind: document.querySelector('.wind'), 
        pressure: document.querySelector('.pressure')
    }
    mySelectors.weather.textContent = processedData.weather;
    mySelectors.location.textContent = processedData.location + ', ' + processedData.country;
    mySelectors.temperature.textContent = processedData.temperature + ' °C'
    mySelectors.feelsLike.textContent = 'Feels Like: ' + processedData.feelsLike + ' °C'
    mySelectors.humidity.textContent = 'Humidity: ' + processedData.humidity + '%';
    mySelectors.wind.textContent = 'Wind: ' + processedData.wind + ' m/s';
    mySelectors.pressure.textContent = 'Pressure: ' + processedData.pressure + ' hPa'
}

function reset () {
    form.reset();
}

function defaultSearch (location) {
    fetchLocation(location)
}
document.addEventListener("DOMContentLoaded", async () => {
  const API_KEY = "f4fce76eb32b29dbb9b9001bbbb2352e";
  const searchButton = document.getElementById("SearchButton");
  const searchBar = document.getElementById("searchBar");
  const api_key = "91192fd1930747f999775234251806";
  const limit = 5;
  const chennaiResponse = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=chennai&days=7`
  );
  const chennaiData = await chennaiResponse.json();
  console.log(chennaiData);
  changeWeatherData(chennaiData);

  document.getElementById("date").textContent = getFormattedDate();
  searchButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const cityName = searchBar.value.trim();
    if (!cityName) return;
    try {
      let cityData = await getCityData(cityName);
      let lat = cityData[0].lat;
      let lon = cityData[0].lon;
      let weatherData = await getWeatherData(cityName);
      console.log(weatherData);
      console.log(weatherData.current.condition.text);
      changeWeatherData(weatherData);
    } catch (error) {
      showError();
    }
  });

  async function getCityData(cityName) {
    const geoCoding = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    const response = await fetch(geoCoding);
    const data = await response.json();
    console.log("Geocoding data:", data);
    return data;
  }

  async function getWeatherData(cityName) {
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${cityName}&days=7`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    return data;
  }
});

function changeWeatherData(weatherData) {
  document.getElementById("errorMessage").classList.add("hidden");
  document.getElementById("weekly").style.display = "flex";
  document.getElementById("weatherDescription").textContent =
    weatherData.current.condition.text;
  document.getElementById("weatherDescriptionRight").textContent =
    weatherData.current.condition.text;
  document.getElementById("date").textContent = getFormattedDate();
  document.getElementById(
    "cityName"
  ).textContent = `${weatherData.location.name}, ${weatherData.location.country} `;
  document.getElementById(
    "temperature"
  ).textContent = `${weatherData.current.temp_c}\u00B0`;
  document.getElementById(
    "temperatureRight"
  ).textContent = `${weatherData.current.temp_c}\u00B0`;
  document.getElementById(
    "windSpeed"
  ).textContent = `${weatherData.current.wind_mph} mph`;
  document.getElementById(
    "windSpeedRight"
  ).textContent = `${weatherData.current.wind_mph} mph`;
  document.getElementById(
    "humidity"
  ).textContent = `${weatherData.current.humidity}%`;
  document.getElementById(
    "humidityRight"
  ).textContent = `${weatherData.current.humidity}%`;
  document.getElementById(
    "feelsLike"
  ).textContent = `Feels like ${weatherData.current.feelslike_c}\u00B0`;
  time = getCurrentTime12HourFormat();
  document.getElementById("time").textContent = time;
  document.getElementById("greet").textContent = getTimeBasedGreeting();
  getWeeklyData(weatherData);
  getHourlyData(weatherData);
}

function getFormattedDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function getCurrentTime12HourFormat() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
}

function getTimeBasedGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 17) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

function showError() {
  document.getElementById("errorMessage").classList.remove("hidden");
  document.getElementById("weekly").style.display = "none";
}

function getWeeklyData(weatherData) {
  const availableDays = weatherData.forecast.forecastday.length;

  for (let i = 0; i < availableDays; i++) {
    const currentDate = new Date(weatherData.forecast.forecastday[i].date);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const formattedDate = `${day}/${month}`;
    const temp = weatherData.forecast.forecastday[i].day.avgtemp_c;

    const element = document.getElementById((i + 1).toString());
    element.querySelector("p").textContent = formattedDate;
    element.querySelector("span").textContent = `${temp}\u00B0`;
    element.style.display = "block"; // just in case some were hidden
  }

  // Hide any extra boxes if they exist in HTML (like id="4", "5", "6")
  for (let i = availableDays + 1; i <= 6; i++) {
    const extra = document.getElementById(i.toString());
    if (extra) extra.style.display = "none";
  }
}

function getHourlyData(weatherData) {
  for (let i = 0; i <= 21; i = i + 3) {
    const data = weatherData.forecast.forecastday[0].hour[i].temp_c;
    document
      .getElementById(`${i}h`)
      .querySelector("span").textContent = `${data}\u00B0`;
  }
}

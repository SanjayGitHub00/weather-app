let cityInput = document.getElementById("city");
let cityWeather = document.getElementById("city-weather");
let searchIcon = document.getElementById("searchBtn");

// Renders dynamic weather HTML
let cityWeatherContent = function (data, location) {
  const weather = data.current;

  return `<div class="text-4xl font-bold">${weather.temperature_2m}°C</div>
            <div class="text-xl">${weather.is_day ? "Daytime" : "Night"}</div>
            <div class="text-md">${location.name}, ${location.country}</div>

            <img src="${
              weather.rain ? "rain.svg" : "sun.svg"
            }" alt="Weather Icon" class="mx-auto w-20 h-20" />
            

            <div class="flex justify-between text-sm mt-6">
                <div>
                    <span class="font-semibold">Wind:</span> ${
                      weather.wind_speed_10m
                    } km/h
                </div>
                <div>
                    <span class="font-semibold">Rain:</span> ${
                      weather.rain || 0
                    } mm
                </div>
            </div>`;
};

// Click event
searchIcon.addEventListener("click", function () {
  const getCoordinates = async (cityName) => {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`
    );
    const data = await res.json();
    const location = data.results?.[0];
    if (!location) {
      cityWeather.innerHTML = `<p class="text-red-500 text-sm">City not found</p>`;
      return null;
    }
    return location;
  };

  const getCurrentWeather = async function () {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const location = await getCoordinates(cityName);
    if (!location) return;

    const { latitude: lat, longitude: lon } = location;

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,wind_speed_10m,rain`
    );
    const data = await res.json();

    cityWeather.innerHTML = cityWeatherContent(data, location);
  };

  getCurrentWeather();
});


"use client";

import { useEffect, useState } from "react";

const cities = {
  Amritsar: [31.634, 74.872],
  Ludhiana: [30.901, 75.857],
  Jalandhar: [31.326, 75.576],
  Patiala: [30.339, 76.386],
  Bathinda: [30.211, 74.945],
  Chandigarh: [30.733, 76.779],
};

function weatherDescription(code) {
  if (code === 0) return "☀️ Clear Sky";
  if (code <= 3) return "⛅ Cloudy";
  if (code <= 48) return "🌫️ Foggy";
  if (code <= 67) return "🌧️ Rain";
  if (code <= 77) return "❄️ Snow";
  if (code <= 82) return "🌦️ Showers";
  if (code >= 95) return "⛈️ Thunderstorm";
  return "🌤️ Variable Weather";
}

function getFarmingAdvice(weather, today) {
  if (!weather || !today) return [];

  const advice = [];

  if (today.precipitation_sum >= 5) {
    advice.push(
      "🌧️ Rain is forecast. Consider postponing irrigation and pesticide spraying."
    );
  } else {
    advice.push(
      "💧 Check soil moisture before irrigating. Weather alone cannot determine water needs."
    );
  }

  if (weather.wind_speed_10m > 25) {
    advice.push(
      "💨 Strong winds may cause spray drift. Avoid spraying until conditions improve."
    );
  }

  if (weather.temperature_2m > 35) {
    advice.push(
      "🌡️ High temperature. Monitor crops for heat stress and moisture loss."
    );
  }

  if (weather.relative_humidity_2m > 85) {
    advice.push(
      "🍃 High humidity. Monitor susceptible crops for fungal disease."
    );
  }

  if (today.precipitation_sum < 1) {
    advice.push(
      "🌾 Little rain is forecast today. Check field conditions before scheduling outdoor work."
    );
  }

  return advice;
}

export default function WeatherPage() {
  const [city, setCity] = useState("Amritsar");
  const [weather, setWeather] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError("");
      setWeather(null);
      setDaily(null);

      const [latitude, longitude] = cities[city];

      const url =
        "https://api.open-meteo.com/v1/forecast" +
        `?latitude=${latitude}&longitude=${longitude}` +
        "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code" +
        "&timezone=Asia%2FKolkata&forecast_days=5";

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Weather service unavailable.");
        }

        const data = await response.json();

        if (!data.current || !data.daily) {
          throw new Error("Incomplete weather data.");
        }

        setWeather(data.current);
        setDaily(data.daily);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load weather. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => controller.abort();
  }, [city]);

  const today = daily
    ? { precipitation_sum: daily.precipitation_sum[0] }
    : null;

  const advice = getFarmingAdvice(weather, today);

  return (
    <main className="min-h-screen bg-green-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-900">
          🌤️ Smart Farming Weather
        </h1>

        <p className="text-gray-600 mt-2 mb-8">
          Real-time weather information and farming guidance.
        </p>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <label className="block font-semibold text-green-900 mb-3">
            📍 Select Your City
          </label>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded-lg p-3 w-full md:w-80 text-gray-900"
          >
            {Object.keys(cities).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="text-green-800 text-center py-10">
            Loading live weather...
          </p>
        )}

        {error && (
          <p className="bg-red-50 text-red-700 p-5 rounded-lg">
            {error}
          </p>
        )}

        {!loading && weather && daily && (
          <>
            <div className="bg-green-800 text-white rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">
                📍 {city}
              </h2>

              <p className="text-5xl font-bold">
                {Math.round(weather.temperature_2m)}°C
              </p>

              <p className="text-xl mt-3">
                {weatherDescription(weather.weather_code)}
              </p>

              <p className="text-green-100 text-sm mt-3">
                Updated: {weather.time.replace("T", " ")} IST
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-500">
                  💧 Humidity
                </p>
                <h3 className="text-3xl font-bold text-green-800 mt-2">
                  {weather.relative_humidity_2m}%
                </h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-500">
                  💨 Wind Speed
                </p>
                <h3 className="text-3xl font-bold text-green-800 mt-2">
                  {weather.wind_speed_10m} km/h
                </h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-500">
                  🌧️ Today's Forecast Rainfall
                </p>
                <h3 className="text-3xl font-bold text-green-800 mt-2">
                  {daily.precipitation_sum[0]} mm
                </h3>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-green-900 mb-5">
              📅 5-Day Weather Forecast
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
              {daily.time.map((date, index) => (
                <div
                  key={date}
                  className="bg-white rounded-xl shadow p-5 text-center"
                >
                  <p className="font-bold text-green-900">
                    {new Date(date + "T12:00:00").toLocaleDateString(
                      "en-IN",
                      { weekday: "short", day: "numeric", month: "short" }
                    )}
                  </p>

                  <p className="text-sm text-gray-500 mt-3">
                    {weatherDescription(daily.weather_code[index])}
                  </p>

                  <p className="text-xl font-bold text-green-800 mt-3">
                    {Math.round(daily.temperature_2m_max[index])}°
                    /{Math.round(daily.temperature_2m_min[index])}°
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    🌧️ {daily.precipitation_sum[index]} mm
                  </p>
                </div>
              ))}
            </div>

            <section className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold text-green-900 mb-5">
                🌱 Smart Farming Advisory
              </h2>

              <div className="space-y-4">
                {advice.map((tip, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border-l-4 border-green-600 p-4 rounded"
                  >
                    <p className="text-gray-800">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-6">
                These are general weather-based suggestions,
                not field-specific agronomic recommendations.
                Check local conditions before making decisions.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

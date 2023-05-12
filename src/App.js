import { useState, useEffect, useRef } from "react";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { gsap, Power3 } from "gsap";

export default function Weather() {
  const [data, setData] = useState({});

  const [location, setLocation] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&lang=ua&appid=0b8b02787c080acb6fca353cae3ba881`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      if (location.trim() === "") {
        toast.error("Please enter a location");
      } else {
        axios
          .get(url)
          .then((response) => {
            setData(response.data);
            setWeatherIcon(getWeatherIcon(response.data.weather[0].icon));
            console.log(response.data);
          })
          .catch((error) => {
            toast.error("Please enter a valid location");
          });
        setLocation("");
      }
    }
  };

  const getWeatherIcon = (icon) => {
    return `http://openweathermap.org/img/w/${icon}.png`;
  };

  let formRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      formRef,
      3,
      {
        opacity: 0,
        y: -800,
      },
      {
        y: 0,
        opacity: 1,
        ease: Power3.easeInOut,
      }
    );
  });

  return (
    <>
      <div className="app">
        <div className="app-input">
          <input
            className="search"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyPress={searchLocation}
            placeholder="Enter location"
            type="text"
          />
        </div>
        <div className="container" ref={(el) => (formRef = el)}>
          <div className="top">
            <div className="location">
              <p className="name-city">{data.name}</p>
            </div>
            <div className="temp">
              {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
              {weatherIcon && <img src={weatherIcon} alt="weather icon" />}
            </div>
          </div>
          <div className="panel">
            {data.name !== undefined && (
              <ul className="details">
                <h4>Weather details</h4>
                <li>
                  <span>Feels Like</span>
                  {data.main ? (
                    <span className="wind">
                      {data.main.feels_like.toFixed()}°C
                    </span>
                  ) : null}
                </li>

                <li>
                  <span>Humidity</span>
                  {data.main ? (
                    <span className="humidity">{data.main.humidity}%</span>
                  ) : null}
                </li>
                <li>
                  <span>Wind Speed</span>
                  {data.wind ? (
                    <span className="cloud">
                      {data.wind.speed.toFixed()} MPH
                    </span>
                  ) : null}
                </li>
                <li>
                  <span>Country</span>
                  {data.sys ? (
                    <span className="">{data.sys.country}</span>
                  ) : null}
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

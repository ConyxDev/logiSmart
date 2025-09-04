import {useEffect, useState} from "react";
import {database} from "../../firebaseConfig";
import {ref, get} from "firebase/database";
import "./weatherForecast.css";

const WeatherForecast = (postalCode) => {
    const [weatherdata, setWeatherData ] = useState([]);
    const [error, setError] = useState(null);
    
    useEffect(() => async {
        const apiKey = "6c05c2c2656babecb6cb77f9e06ffa10";
        const url = `https://api.openweathermap.org/data/2.5/weather?zip=${postalCode},${countryCode}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Impossible de récupérer les données météo.");
            }
            const data = await response.json();
            console.log("données météo", data);
            return data;
        } catch (error) {   
            console.error("Erreur lors de la récupération des données météo :", error);
        }
    };
    
    WeatherForecast();

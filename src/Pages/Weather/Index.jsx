import './index.css'
import { useState } from 'react'
const SECRET = import.meta.VITE_SECRET;
import { Link } from 'react-router'
import WeatherTable from './WeatherTable'
import { meteodata } from './meteodata.js'
import * as Textboxes from '../../components/Textboxes/Textboxes'
import { weatherData, currentWeather } from './weatherdata.js'
import * as WeatherCards from './WeatherCards'
import * as SVG from '../../assets/svg.jsx'
import useUser from '../../contexts/userContext.jsx'



const openweather = {
	API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
	CoordFromLoc: function (location) { return `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${this.API_KEY}` },
	weatherFromLoc: function (lat, lon) { return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}` }
}



export default function Weather() {
	const { uid, user } = useUser();
	const date = new Date();
	const [weatherdata, setWeatherdata] = useState(weatherData);

	// useFetch(openweather.weatherFromLoc(lat, lon), (d)=>setOpenweatherResult(d));

	const onSubmit = () => null;

		

  return (
	<main id="Weather">
		<Textboxes.Search props={{
			name: 'weather-search',
			id: 'weather-search',
			onSubmit: onSubmit,
			data: [],
			placeholder: "Data Provided by OpenWeather API",
			icon: true
		}}/>

		<section id="user">
			{user 
				? <><span>Welcome, {user.displayname}</span><Link to="/logout">Log Out</Link></>
				: <><Link to="/login">Login</Link><Link to="/register">Sign up</Link></>
			}
		</section>

		<section className="hourly">
			<h3>Hourly Forecast</h3>
			<div className="scroll-container">
				<div className="flex-container">
					{weatherdata && weatherdata?.list.map((datum,idx) =>
						<WeatherCards.Day key={idx} props={{
							name: new Date(datum.dt).toDateString().substring(0,4),
							img: SVG.weather.get(datum.clouds.all),
							high: datum.main.temp_min,
							low: datum.main.temp_max,
							temp: datum.main.temp
						}}/>
					)}
					</div>
				</div>
		</section>

		<header className="today">
			<div className="datetime headerA">
				<p>EARTH</p>
				<h1>
					<span className="date">{date.getDate()} </span>
					<span>{date.toDateString().substring(4,7)}</span>
				</h1>
				<span>{new Date().getFullYear()._toRoman()}</span>
				<h3>{weatherdata?.city.name}</h3>
				<h4>{weatherdata?.city.country}</h4>
			</div>

			<div className="current-conditions headerB hide">
				<p>{currentWeather?.weather[0].description}</p>
				<h1>
					<span>{currentWeather?.main.temp._imperialScum('f', 1, 0)}</span>
				</h1>
				<h3>{weatherdata?.city.name}</h3>
				<h4>{weatherdata?.city.country}</h4>
			</div>
		</header>

		<section className="meteo-table">
			<WeatherTable props={{ data: meteodata.data_1h }} />
		</section>
		
		<section className="meteo-map">
			<div className="inner-wrapper">
				<iframe src="https://www.meteoblue.com/en/weather/maps/widget/geneva_united-states_4893591?windAnimation=1&gust=1&satellite=1&cloudsAndPrecipitation=1&temperature=1&sunshine=1&extremeForecastIndex=1&geoloc=fixed&tempunit=F&lengthunit=imperial&windunit=mph&zoom=5&autowidth=auto&user_key=e0654f3385e0b7e3&embed_key=0dfcd7a84e134aa7&sig=6e2505964fb27ca9cebdfba507650ce4818e205678404e7fb02012ceb0b5dbe4" frameborder="0" scrolling="NO" allowtransparency="true" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox" style={{width: '100%', height: '50vh', border: 0, overflow: 'hidden'}}></iframe>
				<div>{/* DO NOT REMOVE THIS LINK */}<a href="https://www.meteoblue.com/en/weather/week/index" target="_blank" rel="noopener">meteoblue</a></div>
			</div>
		</section>
	</main>
  )
}

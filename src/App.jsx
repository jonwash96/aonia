import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, Navigate, redirect } from "react-router";
import { useFetch, useFetchPOST } from './hooks/useFetch'
import RecursiveMap from './components/RecursiveMap'
import Chat from './pages/Chat'
import { ChatProvider } from './contexts/chatContext'
import useUser from './contexts/userContext'
import { ToastContainer, toast } from 'react-toastify';
import AWS from './components/AWS'
import SignInPage from './pages/Auth/SignInPage';



const SECRET = import.meta.VITE_SECRET;
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;
const lat = 41.9344183;
const lon = -88.3762128

const neows = {
	API: import.meta.env.VITE_NASA_NEOWS,
	indexByDateRange: function (start, end) { return `${this.API}feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}` }, // Date Format = 2015-09-07
}

const openweather = {
	API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
	CoordFromLoc: function (location) { return `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${this.API_KEY}` },
	weatherFromLoc: function (lat, lon) { return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}` }
}



function App() {
	const { uid } = useUser();
	const [view, setView] = useState('chat');

	const [meteoblueResult, setMeteoblueResult] = useState();
	const [openweatherResult, setOpenweatherResult] = useState();
	// useFetch(neows.indexByDateRange('2026-02-28', '2026-03-06'), (d)=>setNeoWSResult(d));
	// useFetch(openweather.weatherFromLoc(lat, lon), (d)=>setOpenweatherResult(d));


	return (
		<>
			<nav id="headbar" style={{ position: 'sticky', top: 0 }}>
				<label htmlFor="api">List API Results</label>
				<input onChange={(e) => setView(e.target.id)}
					type="radio" name="nav" id="api" />
				<label htmlFor="chat">Chat</label>
				<input onChange={(e) => setView(e.target.id)}
					type="radio" name="nav" id="chat" />
				<label htmlFor="aws">AWS</label>
				<input onChange={(e) => setView(e.target.id)}
					type="radio" name="nav" id="aws" />
			</nav>

			<Routes>
				<Route
					path="/"
					element={<SignInPage />}
				/>

				<Route
					path="/chat"
					element={
						<ChatProvider uid={uid}>
							<Chat />
						</ChatProvider>
					} />
			</Routes>

		</>
	)
}

export default App
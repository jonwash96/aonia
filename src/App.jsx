import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, Navigate, redirect } from 'react-router'
import { useFetch, useFetchPOST } from './hooks/useFetch'
import Chat from './pages/Chat'
import { ChatProvider } from './contexts/chatContext'
import useUser from './contexts/userContext'
import { ToastContainer, toast } from 'react-toastify'
import AWS from './components/AWS'
import SignInPage from './pages/Auth/SignInPage'
import './utils/bancroft-proto'
import Weather from './pages/Weather'
import Sidebar from './components/Nav/Sidebar'



const SECRET = import.meta.VITE_SECRET;
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;
const lat = 41.9344183;
const lon = -88.3762128

const neows = {
	API: import.meta.env.VITE_NASA_NEOWS,
	indexByDateRange: function (start, end) { return `${this.API}feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}` }, // Date Format = 2015-09-07
}

function App() {
	const { uid } = useUser();
	const [view, setView] = useState('chat');

	const [meteoblueResult, setMeteoblueResult] = useState();
	// useFetch(neows.indexByDateRange('2026-02-28', '2026-03-06'), (d)=>setNeoWSResult(d));
	// useFetch(openweather.weatherFromLoc(lat, lon), (d)=>setOpenweatherResult(d));


	return (
		<main id="App">
			<ChatProvider uid={uid}>
				<Sidebar />
			</ChatProvider>

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
				
				<Route
					path="/weather"
					element={
							<Weather />
					} />
			</Routes>

		</main>
	)
}

export default App
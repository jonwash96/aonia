import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, Navigate, redirect } from 'react-router'
import { useFetch, useFetchPOST } from './hooks/useFetch'
import Chat from './pages/Chat'
import { ChatProvider } from './contexts/chatContext'
import useUser from './contexts/userContext'
import AWS from './components/AWS'
import './utils/bancroft-proto'
import Weather from './pages/Weather'
import Sidebar from './components/Nav/Sidebar'
import People from './pages/People'
import SignInPage from './pages/Auth/SignInPage'
import SignUpPage from './pages/Auth/SignUpPage'
import SignOutPage from './pages/Auth/SignOutPage'


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
			<Sidebar />

			<Routes>
				<Route
					path="/login"
					element={<SignInPage />}
				/>
				
				<Route
					path="/sign-up"
					element={<SignUpPage />}
				/>
				
				<Route
					path="/logout"
					element={<SignOutPage />}
				/>
				

				<Route
					path="/"
					element={<Weather />}
				/>


				<Route
					path="/chat"
					element={
						<ChatProvider uid={uid}>
							<Chat />
						</ChatProvider>}
				/>
				<Route path="chat/:id" element={<Chat />} />
				

				<Route
					path="/weather"
					element={<Weather />}
				/>


				<Route 
					path="users/profile" 
					element={<People />} 
				/>
			</Routes>

		</main>
	)
}

export default App
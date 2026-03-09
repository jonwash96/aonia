// import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, Navigate, redirect } from 'react-router'
// import { useFetch, useFetchPOST } from './hooks/useFetch'
// import Chat from './pages/Chat'
// import { ChatProvider } from './contexts/chatContext'
import useUser from './contexts/userContext.jsx'
// import AWS from './components/AWS'
import './utils/bancroft-proto.js'
import Weather from './pages/Weather/Index.jsx'
import Sidebar from './components/Nav/Sidebar.jsx'
// import People from './pages/People'
import SignInPage from './pages/Auth/SignInPage.jsx'
import SignUpPage from './pages/Auth/SignUpPage.jsx'
import SignOutPage from './pages/Auth/SignOutPage.jsx'


// const SECRET = import.meta.VITE_SECRET;
// const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

// const neows = {
// 	API: import.meta.env.VITE_NASA_NEOWS,
// 	indexByDateRange: function (start, end) { return `${this.API}feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}` }, // Date Format = 2015-09-07
// }

function App() {
	const { uid } = useUser();


	
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


				{/* <Route
					path="/chat"
					element={
						<ChatProvider uid={uid}>
							<Chat />
						</ChatProvider>}
				/>
				<Route path="chat/:id" element={<Chat />} /> */}
				

				<Route
					path="/weather"
					element={<Weather />}
				/>

{/* 
				<Route 
					path="users/profile" 
					element={<People />} 
				/>*/}
			</Routes> 

		</main>
	)
}

export default App
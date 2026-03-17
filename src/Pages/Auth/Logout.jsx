import { useEffect, useContext } from 'react'
import { logout } from '../../services/authService'
import { useNavigate } from 'react-router'
import useUser from "../../contexts/userContext";



export default function Logout() {
	const { setUser, setAuthToken } = useUser();
	const navigate = useNavigate();


	useEffect(() => {
		(async () => {
			try {
				await logout();
				setUser(null)
				setAuthToken(null)
				navigate('/');
			} catch (error) {
				console.error(error)
			}
		})()
	},[])



  return (
	<p>Loading...</p>
  )
}
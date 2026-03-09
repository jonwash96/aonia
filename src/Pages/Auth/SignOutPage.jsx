import { useEffect, useContext } from 'react'
import { logout } from '../../services/authService'
import { useNavigate } from 'react-router'
import useUser from "../../contexts/userContext";



export default function SignOutPage() {
	const { setUser, setAuthToken } = useUser();
	const navigate = useNavigate();


	useEffect(() => {
		(async () => {
			try {
				await logout();
				setUser(null)
				setAuthToken(null)
				navigate('/');
			} catch (err) {
				console.eror(err)
			}
		})()
	},[])



  return (
	<p>Loading...</p>
  )
}
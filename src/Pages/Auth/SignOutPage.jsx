import { useEffect, useContext } from 'react'
import { signOut } from '../../services/authService'
import { errToast } from '../../utils/gizmos'
import { useNavigate } from 'react-router'
import { UserContext } from "../../contexts/UserContext";

export default function SignOutPage() {
	const { setUser, setAuthToken } = useContext(UserContext);
	const navigate = useNavigate();
	useEffect(() => {
		(async () => {
			try {
				await signOut();
				setUser(null)
				setAuthToken(null)
				navigate('/');
			} catch (err) {
				errToast()
			}
		})()
	},[])
  return (
	<p>Loading...</p>
  )
}
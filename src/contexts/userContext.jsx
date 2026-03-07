import React, { useContext, useState } from 'react'



export const UserContext = React.createContext();

export default function useUser() {
	return useContext(UserContext)
}



const getUserFromToken = () => {
    const token = localStorage.getItem('aonia-token');
    if (!token) return null;

    try {
        const parsed = JSON.parse(atob(token.split(".")[1]));
        return parsed?.payload ?? parsed ?? null;
    } catch (error) {
        localStorage.removeItem('aonia-token');
        return null;
    }
}

const getUser = () => JSON.parse(sessionStorage.getItem('userData'));

export function UserProvider({ children }){
    const [user, setUser] = useState(getUser());
    const [authToken, setAuthToken] = useState(getUserFromToken());

	const destroyCredentials = (userCTX=true) => {
		if (localStorage.getItem('aonia-token')) {
			localStorage.removeItem('aonia-token');
			sessionStorage.removeItem('userData');
			console.log("Token Cleared from local Storage.");
		} else {console.log("Token not found. Nothing cleared.")}
		if (userCTX) {
			setUser(null);
			setAuthToken(null);
		}
	}
    
    return <UserContext.Provider value={{ 
		uid: user?._id || null, user, setUser, 
		authToken, setAuthToken,
		destroyCredentials,
		JITAuth: getUserFromToken
	}}>
        {children}
    </UserContext.Provider>
}

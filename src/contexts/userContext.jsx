import React, { useContext, useEffect, useState } from 'react'
import * as userService from '../services/userService'



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
	const [updateNotifications, setudn] = useState();

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
	};

	const findFriends = (query, option) => {
		const findOne = (q) => {
			if (q === user.profile._id) return user.profile;
			switch (option) {
				case 'byUsername': return user.profile.friends.find(f => f.username === q); break;
				case 'byDisplayname': return user.profile.friends.find(f => f.displayname === q); break;
				case 'byID':
				default: return user.profile.friends.find(f => f._id === q); break;
			}	};
	return Array.isArray(query) 
		? query.map(q => findOne(q))
		: findOne(query);
	};


	useEffect(()=> {
		let ignore = false;
		const geaux = async () => {
			const notifications = await userService.getNotifications(user._id, updateNotifications);
			if (!notifications) console.error("@_getNotifications hook. No notifications received.");
			console.log("@_getNotifications. Notifications Received", notifications);
			setUser(prev => ({ ...prev, notifications }));
			return setudn(undefined);
		}; updateNotifications && geaux();
		return () => ignore = true;
	},[updateNotifications])

	const getNotifications = (from=new Date('2022/01/01')) => setudn(from);

    
    return <UserContext.Provider value={{ 
		uid: user?._id || null, 
		user, setUser, 
		authToken, setAuthToken,
		destroyCredentials,
		findFriends,
		JITAuth: getUserFromToken,
		getNotifications
	}}>
        {children}
    </UserContext.Provider>
}
import React, { useContext, useState } from 'react'
import generateRandomUUID from '../utils/generateRandomUUID'

export const UserContext = React.createContext();

export default function useUser() {
	return useContext(UserContext)
}

export function getUID(providedUID) {
	const uidFromStorage = localStorage.getItem('fp-uid');
	if (uidFromStorage) return uidFromStorage
	else { let newUUID;
		if (providedUID) newUUID = providedUID
		else newUUID = generateRandomUUID();
		localStorage.setItem('fp-uid', newUUID);
		return newUUID;
	}
}

export function UserProvider({ children }) {
	const [uid, setUID] = useState(getUID());
	const [user, setUser] = useState();

	const storeUID = (UID, userCTX=true) => {
		localStorage.setItem('fp-uid', UID);
		if (localStorage.getItem('fp-uid') === UID) {
			console.log("UID Set Successfully:", UID);
			setUID(UID);
			userCTX && setUser(null);
		}
		else console.error("Set UID Failed.");
	}

	const destroyUID = (userCTX=true) => {
		if (localStorage.getItem('fp-uid')) {
			localStorage.removeItem('fp-uid');
			console.log("UID Cleared from local Storage.");
		} else {console.log("UID not found. Nothing cleared.")}
		userCTX && setUser(null);
	}

	return (
		<UserContext.Provider value={{ uid, setUID, destroyUID, storeUID, user, setUser }}>
			{children}
		</UserContext.Provider>
	)
}
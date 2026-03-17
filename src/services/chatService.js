import * as userService from './userService'
import { io } from 'socket.io-client'
const BACK_END_SERVER_URL = import.meta.env.VITE_BACK_END_SERVER_URL;


const delay = async (time) => await new Promise(geaux => 
	setTimeout(()=>geaux(), time));

let initializing = false;

export let connection = undefined;


export async function connect(promise, proc, user, chatID, latestChat) {
	if (initializing) return;
	if (connection?.connected === false) return connection.connect()
	else if (connection?.connected === true) return connection;

	console.log("@ChatService > Connect", user._id);
	initializing = true; 
	
	if (!user.profile || !user.profile.friends[0]?.photo.url) {
		console.log("@ChatService > Populting User. . .");
		try {
			const fullyPopulatedUser = await userService.getUserData(user._id, 'profile');
			if (!fullyPopulatedUser) throw new Error("User Hydration failed. Please try again later.")
			
			console.log("@ChatService > Fully Populated User:", fullyPopulatedUser);
			promise.resolve(fullyPopulatedUser);
			await delay(200);

		} catch (err) {
			promise.reject(err);
		}
	} else {promise.reject(null)};
	
	const tokenized = localStorage.getItem('aonia-token');
	
	let serverStatus = await fetch(BACK_END_SERVER_URL+'/chat/', {
		"method": "PATCH",
		"headers": {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Authorization": `Bearer ${tokenized}`
		}
	});
	
	serverStatus = await serverStatus.json();
	if (serverStatus.error) throw new Error ("Error Connecting to the Chat server.", serverStatus.error);
	console.log("@ChatService > Chat Server Status:", serverStatus);
	
	await delay(100);
	console.log("@ChatService > Connecting to chat server...");
	
	try {
		connection = io(serverStatus.url, { 
			query: { uid: user._id, token: tokenized, 
				chatInfo: {chatID: chatID || null, latest: latestChat || null} }
		});
	
		connection.on('connect', () => {
			console.log("@ChatService. socket.io connected to", connection.id);
			initializing = false;
		});
		return proc.fulfil(connection)

	} catch (err) {
		console.error("@chatService. Connection Failed.", err)
		return proc.abort(err)
	}
};


export function disconnect(hard=false) {
	console.log("@Chat Service: Disconnecting chat socket...")
	connection?.disconnect();
	if (hard) connection = undefined;
	return console.log("...Disconnected from chat server.")
}
import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import useUser from './userContext'
import { ToastContainer, toast } from 'react-toastify';
const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;
const BACK_END_PORT = import.meta.env.VITE_BACK_END_PORT;
const CHAT_PORT = import.meta.env.VITE_CHATPORT;
const delay = async (time) => await new Promise(geaux => 
	setTimeout(()=>geaux(), time));

const ChatContext = React.createContext();

export default function useChat() {
	return useContext(ChatContext)
}

export function ChatProvider({ uid, children }) {
	const { setUser, authToken } = useUser();
	const [chatEnabled, setChatEnabled] = useState();
	const [chatSocket, setChatSocket] = useState();
	const [status, setStatus] = useState();
	const [chats, setChats] = useState();
	const [rooms, setRooms] = useState([]);
	const [messages, setMessages] = useState([
		// { text: "Test Message from friend", uid: '123_456A', files: [] },
		// { text: "Test Message from user", uid: uid, files: [] },
	]);

	useEffect(() => {
		// if (!chatEnabled) return;

		async function chatService() {
			console.log("@ChatProvider > Enable Chat. uid", uid);
			const tokenized = localStorage.getItem('aonia-token');

			let serverStatus = await fetch(BACK_END_URL+':'+BACK_END_PORT+'/chat/', {
				"method": "PATCH",
				"headers": {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Authorization": `Bearer ${tokenized}`
				}
			});

			serverStatus = await serverStatus.json();
			if (serverStatus.error) throw new Error ("Error Connecting to the Chat server.", serverStatus.error);
			
			await delay(100);
			
			const socket = io(serverStatus.url, { 
				query: { uid, token: tokenized, chatInfo: {id: null, latest: chats?.messages?.at(-1).time || null} },
			});

			socket.on('connect', () => {
				console.log("@ChatProvider. socket.io connected to", socket.id);
				setChatSocket(socket);
			});

			socket.on("connect_error", (err) => {
				console.log(`connect_error due to ${err.message}`);
			});

			socket.on('receive-userdata', (data) => {
				console.log("@ChatProvider. socket.io user", data);
				setUser(prev => {
					const updatedUser = { ...prev };
					updatedUser.profile.friends = data.friends;
					return updatedUser;
				});
				setChats(data.chats);
			});

			socket.on('receive-chatdata', (data) => {
				console.log("@ChatProvider. chatData received", data);
				setChats(data.chats);
			});

			socket.on('receive-chatupdate', (data, chatID) => {
				console.log("@ChatProvider. chat update received", chatID, data);
				setChats(prev => {
					const idx = prev.findIndex(chat => chat.id === chatID);
					const newChat = [ ...prev[idx], ...data ];
					return prev.splice(idx, 1, newChat);
				})
			});

			socket.on('receive-message', (message) => {
				console.log("Message Received:", message);
				setMessages(prev => [...prev, message])
			});

			socket.on('error', (message, code) => {
				console.log("Socket.io error", code, message);
				setStatus({message, color: 'red'});
			})

		}; chatService();
	}, []);

	return (
		<ChatContext.Provider value={{
			chatSocket,
			messages, setMessages,
			chats, setChats,
			rooms, setRooms,
			status, setStatus
		}}>
			{chatSocket
				? children
				: <p>Initializing Chat. . .</p>
			}
		</ChatContext.Provider>
	)
}
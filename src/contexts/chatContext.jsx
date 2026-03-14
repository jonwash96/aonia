import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import useUser from './userContext'
import * as userService from '../services/userService.js'
import { useNavigate } from 'react-router'
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
	const { user, setUser, authToken } = useUser();
	const [chatEnabled, setChatEnabled] = useState(true);
	const [socket, setSocket] = useState();
	const [status, setStatus] = useState();
	const [chats, setChats] = useState({});
	const [rooms, setRooms] = useState([]);
	const [messages, setMessages] = useState([]);
	// const [messages, setMessages] = useState([
	// 	{ text: "Test Message from friend", uid: '123_456A', files: [] },
	// 	{ text: "Test Message from user", uid: uid, files: [] },
	// ]);
	const navigate = useNavigate();

	const toggleSocket =()=> setChatEnabled(!chatEnabled);

	const deleteChat = (chatID) => {
		socket.emit('delete-chat', uid, chatID);
		socket.on('chat-deleted', (message, chat_id) => {
			setChats(prev => prev.splice(chats.findIndex(chat_id), 1));
			setStatus({message, color: 'red'});
		})
	}

	const renameChat = (chatID, name) => {
		socket.emit('rename-chat', uid, chatID, name);
		socket.on('chat-renamed', (message, chat_name) => {
			setChats(prev => prev.map(chat => 
				chat._id === chatID 
					? { ...chat, name: chat_name }
					: chat
			));
			setStatus({message, color: 'inherit'});
		})
	}

	const findChat = (query, option) => {
			switch (option) {
				case 'single-byUserID': {let found = Object.values(chats).find(chat => 
					chat.users.length === 2 && chat.users.find(u => u === query));
					return found ? found : undefined;
				}; break;
				case 'named': return chats.find(chat => chat.name === query); break;
				case 'chatID':
				default: return chats.find(chat => chat._id === query);
			}
		};
	
	const createChat = (users) => {
		const chatID = 'temp-'+generateRandomUUID();
		const newchat = {
			temp: chatID, 
			name: users.map(u => u.username).join(' & '),
			users: users.map(u => u._id), 
			messages: []
		};
		setChats(prev => ({ ...prev, [chatID]: newchat }));
		return newchat;
	};


	useEffect(() => {
		async function chatService() {
			console.log("@ChatProvider > Enable Chat. uid", uid);

			if (!user.profile.friends[0].photo.url) {
				const fullyPopulatedUser = await userService.getUserData(uid, 'profile');
				if (!fullyPopulatedUser) return navigate('/logout');
				setUser(fullyPopulatedUser);
				await delay(200);
			};

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
			
			setSocket( io(serverStatus.url, { 
				query: { uid, token: tokenized, 
					chatInfo: {id: null, latest: chats?.messages?.at(-1).time || null} },
			}));

		}; chatEnabled && chatService();
	},[chatEnabled]);

	

	if (socket) {
		socket.on('connect', () => {
			console.log("@ChatProvider. socket.io connected to", socket.id);
			setSocket(socket);
		});

		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});

		socket.on('receive-userdata', (data) => {
			console.log("@ChatProvider. socket.io user", data);
			setChats(data.chats);
		});

		socket.on('receive-chatdata', (chats) => {
			/* Receives all chat objs from server on connection */
			console.log("@ChatProvider. chatData received", chats);
			setChats (() => {
				const obj = {};
				chats.forEach(chat => obj[chat._id] = chat);
			});
		});

		socket.on('receive-chatupdate', (data, chatID) => {
			console.log("@ChatProvider. chat update received", chatID, data);
			setChats(prev => {
				const idx = prev.findIndex(chat => chat._id === chatID);
				const newChat = { ...prev[idx], ...data };
				return prev.splice(idx, 1, newChat);
			})
		});

		socket.on('receive-message', (message, chatID) => {
			console.log("Message Received:", message);
			setChats(prev => ({ ...prev, [chatID]: { 
				...prev[chatID], messages: [ ...prev[chatID].messages, message ]
			} }));
		});

		socket.on('error', (message, code) => {
			console.log("Socket.io error", code, message);
			setStatus({message, color: 'red'});
		})
	}



	return (
		<ChatContext.Provider value={{
			socket, 	toggleSocket,
			messages, 	setMessages,
			chats, 		setChats,
			rooms, 		setRooms,
			status, 	setStatus,
			createChat,	findChat,
			deleteChat, renameChat
		}}>
			{socket
				? children
				: <button onClick={()=>setChatEnabled(true)}>Enable</button>
			}
		</ChatContext.Provider>
	)
}
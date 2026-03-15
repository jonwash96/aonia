import React, { useContext, useEffect, useState, useMemo } from 'react'
import { io } from 'socket.io-client'
import useUser from './userContext'
import * as userService from '../services/userService.js'
import { useNavigate } from 'react-router'
const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;
const BACK_END_PORT = import.meta.env.VITE_BACK_END_PORT;
const CHAT_PORT = import.meta.env.VITE_CHATPORT;
import generateRandomUUID from '../utils/generateRandomUUID'

const delay = async (time) => await new Promise(geaux => 
	setTimeout(()=>geaux(), time));



const ChatContext = React.createContext({
	socket: null, status: null
});

export default function useChat() {
	return useContext(ChatContext)
}



export function ChatProvider({ uid, children }) {
	const { user, setUser, authToken } = useUser();
	const [chatEnabled, setChatEnabled] = useState(false);
	const [socket, setSocket] = useState();
	const [status, setStatus] = useState();
	const [chats, setChats] = useState({});
	const [chatSelect, setChatSelect] = useState();
	// const [messages, setMessages] = useState([
	// 	{ text: "Test Message from friend", uid: '123_456A', files: [] },
	// 	{ text: "Test Message from user", uid: uid, files: [] },
	// ]);
	const navigate = useNavigate();

	const toggleSocket =()=> setChatEnabled(!chatEnabled);

	const selectChat = (chat) => {
		setChatSelect(chat);
		socket.emit('join-room', uid, chat._id);
	};

	const deleteChat = (chatID) => {
		socket.emit('delete-chat', uid, chatID);
		socket.on('chat-deleted', (message, chat_id) => {
			setChats(prev => prev.splice(chats.findIndex(chat_id), 1));
			setStatus({message, color: 'red'});
		})
	};

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
	};

	const appendMessage = (message, chatID) => {
		setChats({ ...chats, [chatID]: { 
			...chats[chatID], messages: [ ...chats[chatID].messages, message ]
		} });
	};

	const findChat = (query, option) => {
			switch (option) {
				case 'single-byUserID': {let found = Object.values(chats).find(chat => 
					chat.users.length === 2 && chat.users.find(u => u === query));
					return found ? found : undefined;
				}; break;
				case 'named': return chats.find(chat => chat.name === query); break;
				case 'bychatID': console.log("@findChat", option, query)
				default: return chats[query];
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
		return newchat;
	};


	useEffect(() => {
		let ignore = false;
		async function chatService() {
			console.log("@ChatProvider > Enable Chat. uid", uid);

			if (!user.profile.friends[0]?.photo.url) {
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
					chatInfo: {chatID: chatSelect?._id || null, latest: chats?.messages?.at(-1).time || null} },
			}));

		}; chatEnabled && !socket && chatService();
		return () => {ignore = true; socket?.disconnect(); setSocket(undefined); setChatEnabled(false)}
	},[chatEnabled]);

	

	if (socket) {
		socket.on('connect', () => {
			console.log("@ChatProvider. socket.io connected to", socket.id);
			setSocket(socket);
		});

		socket.on("connect_error", async (err) => {
			console.error(`connect_error due to ${err.message}`);
			socket.disconnect();
			toggleSocket();
			await delay(200);
			toggleSocket();
		});

		socket.on('receive-userdata', (data) => {
			console.log("@ChatProvider. socket.io user", data);
			setChats(data.chats);
		});

		socket.on('chatdata', (chats) => {
			/* Receives all chat objs from server on connection */
			console.log("@ChatProvider. chatData received", chats);
			const obj = {};
			chats.length > 0 && chats.forEach(chat => obj[chat._id] = chat);
			setChats(obj);
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
			appendMessage(message, chatID);
		});

		socket.on('chat-created', async (chat) => {
			console.log("...New Chat Created:", chat);
			setChats(prev => ({ ...prev, [chat._id]: chat }));
			await delay(100)
			selectChat(chats[chat._id]);
		});

		socket.on('error', (message, code) => {
			console.warn("Socket.io error", code, message);
			socket.disconnect();
			setStatus({message, color: 'red'});
		})
	}



	return (
		<ChatContext.Provider value={{
			socket, 	toggleSocket,
			appendMessage,
			chats, 		setChats,
			chatSelect, selectChat,
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
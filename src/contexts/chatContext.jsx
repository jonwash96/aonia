import React, { useContext, useEffect, useState, useMemo } from 'react'
import { io } from 'socket.io-client'
import useUser from './userContext'
import * as userService from '../services/userService.js'
import { useNavigate } from 'react-router'
import generateRandomUUID from '../utils/generateRandomUUID'
import { connection, connect, disconnect, ping } from '../services/chatService.js'
import { _chats } from '../data/exoState.js'
const BACK_END_SERVER_URL = import.meta.env.VITE_BACK_END_SERVER_URL;
const BACK_END_PORT = import.meta.env.VITE_BACK_END_PORT;
const CHAT_PORT = import.meta.env.VITE_CHATPORT;

const delay = async (time) => await new Promise(geaux => 
	setTimeout(()=>geaux(), time));



const ChatContext = React.createContext({
	socket: connection
});

export default function useChat() {
	return useContext(ChatContext)
}



export function ChatProvider({ uid, children }) {
	const { user, setUser, authToken, storeUser } = useUser();
	const [chatEnabled, setChatEnabled] = useState(false);
	const [socket, setSocket] = useState();
	const [status, setStatus] = useState();
	const [chats, _setChats] = useState(_chats);
	const [chatSelect, setChatSelect] = useState();
	// const [messages, setMessages] = useState([
	// 	{ text: "Test Message from friend", uid: '123_456A', files: [] },
	// 	{ text: "Test Message from user", uid: uid, files: [] },
	// ]);
	const navigate = useNavigate();

	const toggleSocket = () => {
		setChatEnabled(!chatEnabled);
		socket?.connected === true
			&& disconnect();
		socket?.connected === false
			&& setSocket(connect())
	};

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

	const setChats = async (data) => {
		Object.assign(_chats, data);
		_setChats({ ..._chats })
		console.log(chats)
	};

	const appendMessage = async (message, chatID, markUnread=false) => {
		console.log("@exoChat Chats:", chats);
		_chats[chatID].messages.push(message);
		_chats[chatID].markUnread = markUnread;
		_setChats(prev => ({ ..._chats }));
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



	useEffect(()=> {
		if (chatEnabled) {
			new Promise((fulfil, abort) => {
				new Promise((resolve, reject) => {
					connect({resolve, reject}, {fulfil, abort}, user, chatSelect?._id)
				})
				.then(userData => storeUser(userData))
				.catch(err => err && console.error(err)) ;
			})
			.then(_socket => setSocket(_socket))
			.catch(abort => setChatEnabled(false));
		}
	},[chatEnabled]);


	if (socket) {
		socket.on("connect_error", async (err) => {
			console.error(`connect_error due to ${err.message}`);
			console.warn("Socket:", socket);
			disconnect(true);
			socket && setSocket(prev => null);
		});

		socket.on('chatdata', (chats) => {
			/* Receives all chat objs from server on connection */
			console.log("@ChatProvider. chatData received", chats);
			const obj = {};
			chats.length > 0 && chats.forEach(chat => {
				socket.emit('join-room', uid, chat._id)
				obj[chat._id] = chat
			});
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
			console.log("chats", chats)
			let markUnread = !(chatSelect && chatSelect?._id === chatID);
			appendMessage(message, chatID, markUnread);
		});

		socket.on('chat-created', async (chat) => {
			console.log("...New Chat Created:", chat);
			setChats(prev => ({ ...prev, [chat._id]: chat }));
			await delay(100)
			selectChat(chats[chat._id]);
		});

		socket.on('error', (message, code) => {
			console.warn("Socket.io error", code, message);
			// socket.disconnect();
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
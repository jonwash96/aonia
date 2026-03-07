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
	const [socket, setSocket] = useState();
	const [status, setStatus] = useState();
	const [chats, setChats] = useState();
	const [rooms, setRooms] = useState([]);
	const [messages, setMessages] = useState([
		// { text: "Test Message from friend", uid: '123_456A', files: [] },
		// { text: "Test Message from user", uid: uid, files: [] },
	]);

	const toggleSocket =()=> setSocket(!socket);

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
			
			setSocket (io(serverStatus.url, { 
				query: { uid, token: tokenized, chatInfo: {id: null, latest: chats?.messages?.at(-1).time || null} },
			}));

		}; chatService();
	}, []);


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
	}



	return (
		<ChatContext.Provider value={{
			socket, toggleSocket,
			messages, setMessages,
			chats, setChats,
			rooms, setRooms,
			status, setStatus,
			deleteChat, renameChat
		}}>
			{socket
				? children
				: <p>Initializing Chat. . .</p>
			}
		</ChatContext.Provider>
	)
}
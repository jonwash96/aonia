import React, { useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import useUser from './userContext'
import { ToastContainer, toast } from 'react-toastify';

const ChatContext = React.createContext();

export default function useChat() {
	return useContext(ChatContext)
}

export function ChatProvider({ uid, children }) {
	const { setUser } = useUser();
	const [chatSocket, setChatSocket] = useState();
	const [status, setStatus] = useState();
	const [chats, setChats] = useState();
	const [rooms, setRooms] = useState([]);
	const [conversation, setConversation] = useState([
		// { text: "Test Message from friend", uid: '123_456A', files: [] },
		// { text: "Test Message from user", uid: uid, files: [] },
	]);

	useEffect(() => {
		console.log("@ChatProvider. uid", uid);
		const socket = io('http://stardestroyer-1701.local:28000', { 
			query: { uid, convoID: null },
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
			setUser(data);
			setChats(data.chats);
		});

		socket.on('receive-chatdata', (data) => {
			console.log("@ChatProvider. chatData received", data);
			setConversation(data.messages);
		});

		socket.on('receive-message', (message) => {
			console.log("Message Received:", message);
			setConversation(prev => [...prev, message])
		});

		socket.on('error', (message, code) => {
			console.log("Socket.io error", code, message);
			setStatus({message, color: 'red'});
		})

		return () => socket.close()
	}, [uid]);

	return (
		<ChatContext.Provider value={{
			chatSocket,
			conversation, setConversation,
			chats, setChats,
			rooms, setRooms,
			status, setStatus
		}}>
			{children}
		</ChatContext.Provider>
	)
}

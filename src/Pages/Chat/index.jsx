import { useState, useEffect } from 'react'
import './index.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate, useParams } from 'react-router'
import Conversation from './Conversation'
import ChatsList from './ChatsList'



export default function Chat() {
	const { uid, user, destroyCredentials, storeUID } = useUser();

	const { socket,	messages,	setMessages,
			chats, 	setChats, 	status, 	setStatus } = useChat();
			
	const [chatSelect, selectChat] = useState();

	const changeRooms = (chat) => {
		selectChat(chat);
		socket.emit('join-room', uid, convoID);
	};

	return (
		<main id="Chat">
			<ChatsList props={{
				chatSelect, selectChat
			}}/>
			<Conversation props={{
				chatSelect, selectChat, changeRooms
			}}/>
		</main>
	)
}
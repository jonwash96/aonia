import { useState,  } from 'react'
import './index.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import PeopleMain from './PeopleMain'
import PeopleList from './PeopleList'
import { useParams, Link, useNavigate } from "react-router";



export default function People() {
	const { uid, user, destroyCredentials, storeUID } = useUser();

	const { chatSocket:socket,	messages,	setMessages,
			chats, setChats, 	status, 	setStatus } = useChat();

	const defaultState = { text: '', files: [], color:'inherit' };
	const [input, setInput] = useState(defaultState);
	const [chatSelect, selectChat] = useState();
	const [cmdHistory, setCmdHistory] = useState([]);
	const navigate = useNavigate();

	const { } = useParams();


	const changeRooms = (convoID) => {
		selectChat(convoID);
		socket.emit('join-room', uid, convoID);
	};




	return (
		<main id="People">
			<ChatsList props={{
				chatSelect, selectChat
			}}/>
			<Conversation props={{
				chatSelect, selectChat, changeRooms
			}}/>
		</main>
	)
}
import { useState } from 'react'
import './index.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate, useParams } from 'react-router'
import Conversation from './Conversation'
import ChatsList from './ChatsList'



export default function Chat() {
	const { uid, user, destroyCredentials, storeUID } = useUser();
	const { socket,	messages,	setMessages,
			chats, setChats, 	status, 	setStatus } = useChat();
	const defaultState = { text: '', files: [], color:'inherit' };
	const [input, setInput] = useState(defaultState);
	const [chatSelect, selectChat] = useState();
	const [cmdHistory, setCmdHistory] = useState([]);
	const navigate = useNavigate();

	const { id } = useParams();


	const changeRooms = (convoID) => {
		selectChat(convoID);
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




function ThreadedMessages({ messages, uid }) {
	// console.log("@messages", messages)
	const bubbleColor = (message) => message.text.startsWith('/')
		? 'cmd'
		: message.uid===uid ? 'user' : 'friend';

	return (
		<>
		{messages?.length === 0 && <h3>Select a Message</h3>}
		{messages?.map((message,idx) => 
			<div key={idx} className={"bubble "+bubbleColor(message)} name={message.user}>
				{message.text}<br/>
				<small>
					User: {message.uid}<br/>
					UID: {uid}<br/>
					Session: {message.session}
				</small>
			</div>
		)}
		</>
	)
}
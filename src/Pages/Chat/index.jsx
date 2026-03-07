import { useState } from 'react'
import './index.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate } from 'react-router'
import Conversation from '../../views/Chat/Conversation'



export default function Chat() {
	const { uid, user, destroyCredentials, storeUID } = useUser();
	const { chatSocket:socket,	messages,	setMessages,
			chats, setChats, 	status, 	setStatus } = useChat();
	const defaultState = { text: '', files: [], color:'inherit' };
	const [input, setInput] = useState(defaultState);
	const [chatSelect, selectChat] = useState();
	const [cmdHistory, setCmdHistory] = useState([]);
	const navigate = useNavigate();


	const changeRooms = (convoID) => {
		selectChat(convoID);
		socket.emit('join-room', uid, convoID);
	};

	const handleChange = (et) => {
		const inputColor = et.value.startsWith('/') ? '#0bf' : 'inherit';
		setInput(prev => ({ ...prev, [et.name]: et.value, color: inputColor }));
	};


	return (
		<main id="Chat">
		<nav>
			<strong>Chats: </strong>
			{chats?.map(chat => <span key={chat._id}>
				<label htmlFor={chat._id}>
					{chat.name}
				</label>
				<input onChange={(e)=>changeRooms(e.target.id)} 
				type="radio" name="roomSelect" id={chat._id} 
				checked={chatSelect === chat._id || false} />
			</span>)}
		</nav>

		<Conversation />
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
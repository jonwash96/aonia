import { useState } from 'react'
import './index.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate } from 'react-router'



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

	const clear = () => setInput(defaultState);

	const handleKeys = (e) => {
		if (input.text.startsWith('/') || input.text === '') {
			if (e.key === 'ArrowUp') {
				e.preventDefault();
				if ('prevNode' in input) setInput(cmdHistory.at(input.prevNode))
					else if (cmdHistory.length > 0) setInput(cmdHistory.at(-1));
			}
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				if ('nextNode' in input && cmdHistory.length > input.nextNode) 
					setInput(cmdHistory.at(input.nextNode))
				else if ('nextNode' in input && cmdHistory.length === input.nextNode)
					setInput(defaultState)
			}
	}};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (input.text === '') return console.log("No input");
		console.log(input);

		const newMessage = { ...input, uid: uid, session: (user?.session || socket.id) };
		setMessages(prev => [ ...prev, newMessage ]);

		if (input.text.startsWith('/')) {
			setCmdHistory(prev => [ ...prev, { 
				...newMessage, 
				prevNode: cmdHistory.length === 0 ? 0 : cmdHistory.length -1, 
				nextNode: cmdHistory.length +1 } ])
		};

		//* DEV MODE //
		if (input.text==='/clear') {
			destroyCredentials(); 
			navigate('/');
			window.location.reload();
			return clear()
		};

		if (input.text.match(/^\/setUID\s?\=\s?\S+/gi)) 
			storeUID(input.text.match(/^\/setUID\s?\=\s?["']?(.+)["']?/)[1], uid)

		else if (input.text.match(/^\/join user\s*\S+/gi)) 
			socket.emit('join-user', uid, input.text.match(/(?<=join\s?user\s)\S+/gi)[0])

		else if (input.text.match(/^\/join\s*\S+/gi)) 
			socket.emit('join-room', uid, input.text.match(/(?<=join\s)\S+/gi)[0])

		else if (input.text.match(/^\/leave\s*\S+/gi)) 
			socket.emit('leave-room', uid, input.text.match(/(?<=leave\s)\S+/gi)[0])

		else if (input.text.match(/^\/cmd\s\S+/gi)) 
			socket.emit('cmd', uid, input.text.match(/(?<=cmd\s)\S+/gi)[0])
		
		else if (input.text.match(/^\/broadcast\s\S+/gi)) 
			socket.emit('broadcast', uid, input.text.match(/(?<=broadcast\s).+/gi)[0])


		else socket.emit('send-message', uid, newMessage, chatSelect);
		clear();
	};

	
	return (
		<>
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

		<main id="chat">
			<header>
				<h1>Chat</h1>
			</header>

			<section id="messages">
					{!chats || chats.length === 0 
						? <h3>Start a Chat</h3>
						: <ThreadedMessages messages={messages} uid={uid} />}
			</section>

			<section id="write">
				<form onSubmit={handleSubmit}>
					<div className="upload">
						<input type="file" name="files" onChange={e => handleChange(e.target)} />
					</div>
					<div className="input">
						<input type="text" name="text" 
						onChange={e => handleChange(e.target)} 
						style={{color: input.color}}
						value={input.text}
						onKeyDown={handleKeys}
						autoComplete="off"
						/>
						<button type="button" onClick={clear}>❌</button>
						<button type="submit">➣</button>
					</div>
				</form>
			</section>
		</main>
		</>
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
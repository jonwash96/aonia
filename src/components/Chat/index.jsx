import { useState, useEffect } from 'react'
import './index.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'

export default function Chat() {
	const { uid, user, destroyUID, storeUID } = useUser();
	const { chatSocket:socket, conversation, setConversation, chats, setChats, rooms, setRooms, status, setStatus } = useChat();
	const defaultState = { text: '', files: [], color:'inherit' };
	const [input, setInput] = useState(defaultState);
	const [roomSelect, setRoomSelect] = useState();
	const [cmdHistory, setCmdHistory] = useState([]);

	const changeRooms = (convoID) => {
		setRoomSelect(convoID);
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
	}}

	const handleSubmit = (e) => {
		e.preventDefault();
		if (input.text === '') return console.log("No input");
		console.log(input);

		const newMessage = { ...input, uid: uid, session: user?.session || socket.id };
		setConversation(prev => [ ...prev, newMessage ]);

		if (input.text.startsWith('/')) {
			setCmdHistory(prev => [ ...prev, { 
				...newMessage, 
				prevNode: cmdHistory.length === 0 ? 0 : cmdHistory.length -1, 
				nextNode: cmdHistory.length +1 } ]);
		};

		if (input.text==='clear') {destroyUID(); return clear()};

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

		else socket.emit('send-message', uid, newMessage, roomSelect);
		clear();
	}

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
				checked={roomSelect === chat._id || false} />
			</span>)}
		</nav>

		<div style={{borderBottom: '1px solid grey'}}>
			<strong>Current Rooms:</strong> {rooms?.join(', ')}<br/>
			<span style={{color: status?.color}}>{status?.message}</span>
		</div>
		<main id="chat">
			<header>
				<h1>Chat</h1>
			</header>

			<section id="conversation">
					<ThreadedConversation conversation={conversation} uid={uid} />
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

function ThreadedConversation({ conversation, uid }) {
	// console.log("@conversation", conversation)
	const bubbleColor = (message) => message.text.startsWith('/')
		? 'cmd'
		: message.uid===uid ? 'user' : 'friend';

	return (
		<>
		{conversation.length === 0 && <h3>Select a Conversation</h3>}
		{conversation?.map((message,idx) => 
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
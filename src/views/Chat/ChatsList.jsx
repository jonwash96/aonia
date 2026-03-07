import { useState } from 'react'
import './index.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate } from 'react-router'



export default function Chat() {
	const { uid, user, destroyUID, storeUID } = useUser();
	const { chatSocket: socket, messages, setMessages,
		chats, setChats, status, setStatus } = useChat();
	const defaultState = { text: '', files: [], color: 'inherit' };
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
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (input.text === '') return console.log("No input");
		console.log(input);
	};

	const newChat = () => {
		selectChat(null);
		setMessages([]);
	};


	return (
		<main id="ChatList">
			<header>
				<Textboxes.Search props={{
					name: 'searchChats',
					input,
					onChange: handleChange,
					onSubmit: handleSubmit,
					data: { chats, friends },
					icon: { content: "🔍" },
					button: false,
				}} />
				<Menus.Ellipses props={{
					name: 'chat-list-menu',
					'&new_message': newChat,
					'&view_friends': ()=>navigate('/users/friends'),
					'&profile': ()=>navigate('/users/profile'),
					'&disconnect%connect': [socket, toggleSocket],
				}} />
			</header>

			<Lists.ContentList props={{
				name: 'chats',
				items: chats,
				titles: '&name',
				details: '&messages, arr, last',
				maxLines: 2,
				icon: {images: 'eval::&users.find(u => u._id !== user.id)'},
				user,
				menu: {
					name: 'chat-list-item-menu',
					'&delete': deleteChat,
					'&rename': renameChat,
				},
			}} />
		</main>
	)
}
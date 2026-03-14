import './index.css'
import { useState } from 'react'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate } from 'react-router'
import ImageIcon from '../../components/ImageIcon'
import * as Menus from '../../components/Menus'
import * as Lists from '../../components/Lists'
import * as Textboxes from '../../components/Textboxes/Textboxes'
import generateRandomUUID from '../../utils/generateRandomUUID'




export default function ChatsList({props}) {
	const { chatSelect, selectChat } = props;
	const { uid, user } = useUser();

	const {	socket,	toggleSocket,	messages,	setMessages,
			chats,	setChats, 		status, 	setStatus, 
			deleteChat,	renameChat,	 } = useChat();

	const [view, setView] = useState(false);
	const toggleView =()=> setView(!view);

	const navigate = useNavigate();

	const users = chatSelect?.users;
	const friends = user.profile?.friends || undefined;

	const handleChange = (et) => {
		const inputColor = et.value.startsWith('/') ? '#0bf' : 'inherit';
		setInput(prev => ({ ...prev, [et.name]: et.value, color: inputColor }));
	};

	const handleSubmit = (e) => {
		e.preventDefault()
		users?.filter(u => u.username === input);
	}

	const findChat = (query, option) => {
		switch (option) {
			case 'single-byUserID': {let found = Object.values(chats).find(chat => 
				chat.users.length === 2 && chat.users.find(u => u === query));
				return found ? found : undefined;
			}; break;
			case 'named': return chats.find(chat => chat.name === query); break;
			case 'chatID':
			default: return chats.find(chat => chat._id === query);
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
		setChats(prev => ({ ...prev, [chatID]: newchat }));
		return newchat;
	};

	const handleChatSelection = (query, option) => {
		let chat = findChat(query, option);
		if (!chat) chat = createChat([user, friends.find(f => f._id === query)]);

		selectChat(chat);
		setMessages(chat.messages);
	};


	return (
		<main id="ChatList">
			<header>
				<Textboxes.Search props={{
					name: 'searchChats',
					onSubmit: handleSubmit,
					data: { chats, friends },
					icon: { content: "🔍" },
					button: false,
				}} />
				<Menus.Ellipses props={{
					name: 'chat-list-menu',
					icon: 'c-ellipses',
					'&new_message': createChat,
					'&view_friends%view_chats': [view, toggleView],
					'&profile': ()=>navigate('/users/profile'),
					'&disconnect%connect': [socket, toggleSocket],
				}} />
				{view ? <h2>Chats</h2> : <h2>Friends</h2>}
			</header>

			{view ? (
				<Lists.ContentList props={{
					name: 'chats',
					items: chats || [],
					titles: '&name',
					details: '&messages?.at(-1).text',
					maxLines: 2,
					icon: {images: '&photo.url'},
					user,
					defaultMessage: "Looks Like you don't have any chats. Add a friend to start a new chat.",
					menu: {
						name: 'chat-list-item-menu',
						'&delete': deleteChat,
						'&rename': renameChat,
					},
				}}/>
			) : (
				<Lists.ContentList props={{
					name: 'friends',
					items: friends || [],
					titles: '&displayname',
					details: '&_id',
					maxLines: 1,
					icon: {images: '&photo?.url'},
					onClick: [handleChatSelection, '&_id', 'single-byUserID'],
					user,
					menu: {
						name: 'friends-list-item-menu',
						'&send_message': [navigate, '/chat/&{_id}']
					},
				}}/>
			)}
		</main>
	)
}
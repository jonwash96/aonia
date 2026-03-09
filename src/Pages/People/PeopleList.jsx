import { useState } from 'react'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate } from 'react-router'
import ImageIcon from '../../components/ImageIcon'
import * as Menus from '../../components/Menus'
import * as Lists from '../../components/Lists'
import * as Textboxes from '../../components/Textboxes/Textboxes'



export default function ChatsList({ chatSelect, selectChat, changeRooms }) {
	const { uid, user } = useUser();

	const {	socket,	toggleSocket,	messages,	setMessages,
			chats,	setChats, 		status, 	setStatus, 
			deleteChat,	renameChat,	 } = useChat();

	const navigate = useNavigate();

	const users = chatSelect?.users;
	const friends = user.profile.friends;

	const handleChange = (et) => {
		const inputColor = et.value.startsWith('/') ? '#0bf' : 'inherit';
		setInput(prev => ({ ...prev, [et.name]: et.value, color: inputColor }));
	};

	const newChat = () => {
		selectChat(null);
		setMessages([]);
	};

	const handleSubmit = (e) => null;


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
					'&new_message': newChat,
					'&view_friends': ()=>navigate('/users/friends'),
					'&profile': ()=>navigate('/users/profile'),
					'&disconnect%connect': [socket, toggleSocket],
				}} />
			</header>

			<Lists.ContentList props={{
				name: 'chats',
				items: chats || [],
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
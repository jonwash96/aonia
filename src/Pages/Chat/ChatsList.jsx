import { useState } from 'react'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate } from 'react-router'
import ImageIcon from '../../components/ImageIcon'
import * as Menus from '../../components/Menus'
import * as Lists from '../../components/Lists'
import * as Textboxes from '../../components/Textboxes/Textboxes'
import './index.css'




export default function ChatsList({props}) {
	const { chatSelect, selectChat } = props;
	const { uid, user } = useUser();

	const {	socket,	toggleSocket,	messages,	setMessages,
			chats,	setChats, 		status, 	setStatus, 
			deleteChat,	renameChat,	 } = useChat();

	const [view, setView] = useState(true);
	const toggleView =()=> setView(!view);

	const navigate = useNavigate();

	const users = chatSelect?.users;
	const friends = user.profile?.friends || undefined;

	const handleChange = (et) => {
		const inputColor = et.value.startsWith('/') ? '#0bf' : 'inherit';
		setInput(prev => ({ ...prev, [et.name]: et.value, color: inputColor }));
	};

	const newChat = () => {
		selectChat(null);
		setMessages([]);
		setView(false);
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
					icon: 'c-ellipses',
					'&new_message': newChat,
					'&view_friends%view_chats': [view, toggleView],
					'&profile': ()=>navigate('/users/profile'),
					'&disconnect%connect': [socket, toggleSocket],
				}} />
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
					icon: {images: '&photo.url'},
					onClick: navigate,
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
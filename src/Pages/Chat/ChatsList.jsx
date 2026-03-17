import './index.css'
import { useState } from 'react'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate } from 'react-router'
import ImageIcon from '../../components/ImageIcon'
import * as Menus from '../../components/Menus'
import * as Lists from '../../components/Lists'
import SmartTextbox from '../../components/Textboxes'




export default function ChatsList({props}) {
	const { uid, user, findFriends } = useUser();

	const {	socket, toggleSocket,	appendMessage,	
			chats,		setChats,	chatSelect, 	selectChat, 
			createChat, findChat,	deleteChat,		renameChat,	 } = useChat();

	const [view, setView] = useState(true);
	const toggleView =()=> setView(!view);

	const navigate = useNavigate();

	const users = chatSelect ? findFriends(chatSelect?.users) : undefined;
	const friends = user.profile?.friends || undefined;

	const handleSubmit = (e) => {
		e.preventDefault();
		users?.filter(u => u.username === input);
	}

	const handleChatSelection = (query, option) => {
		let chat = findChat(query, option);
		if (!chat) chat = createChat([user.profile, friends.find(f => f._id === query)]);
		if (chat?.markUnread) chat.markUnread = false;
		return selectChat(chat);
	};

	const getFriendPhotoUrl = (friendID) => findFriends(friendID).photo.url;


	return (
		<main id="ChatList">
			<header>
				<SmartTextbox type="Search" props={{
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
					'&disconnect%connect': [socket?.connected, toggleSocket],
				}} />
				{view ? <h2>Chats</h2> : <h2>Friends</h2>}
			</header>

			{view ? (
				<Lists.ContentList props={{
					name: 'chats',
					items: Object.values(chats) || [],
					titles: '&name',
					details: '&messages?.at(-1).text',
					maxLines: 2,
					style: { border: '&markUnread ? "1px solid white" : "inherit"' },
					onClick: [handleChatSelection, '&_id', 'byChatID'],
					icon: {images: [getFriendPhotoUrl, '&messages?.at(-1).uid', true]},
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
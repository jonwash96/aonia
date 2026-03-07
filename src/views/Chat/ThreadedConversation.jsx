import { useState } from 'react'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate } from 'react-router'



export default function ThreadedConversation() {
	const { uid, user, destroyUID, storeUID } = useUser();
	const { chatSocket: socket, messages, setMessages,
		chats, setChats, status, setStatus } = useChat();
	const defaultState = { text: '', files: [], color: 'inherit' };
	const [input, setInput] = useState(defaultState);
	const [chatSelect, selectChat] = useState();
	const navigate = useNavigate();

	const { users } = chatSelect.users;


	const changeRooms = (convoID) => {
		selectChat(convoID);
		socket.emit('join-room', uid, convoID);
	};

	const newChat = () => {
		selectChat(null);
		setMessages([]);
	};


	return (
		<main id="ChatList">
			<header>
				<ImageIcon 
					src={users[messages.at(-1).uid].photo.url} //? Last message not user sender photo
					role="profile-photo" 
					size={icon.size || '24px'}
				/>
				<h1>
					{chatSelect.name}
				</h1>
				<Menus.Ellipses props={{
					name: 'chat-menu',
					'&new_message': newChat,
					'&friends': ()=>navigate('/users/friends'),
					'&profile': ()=>navigate('/users/profile'),
					'&disconnect%connect': [socket, toggleSocket],
					'&delete': deleteChat,
					'&rename': renameChat,
				}} />
			</header>

			<ChatWindow props={{
				name: chats,
				chats, user, users,
			}} />

			<Textboxes.SmartMessage props={{
				name: 'chat-input',
				input,
				onChange: handleChange,
				onSubmit: handleSubmit,
				onClear: clear,
				data: { chats, friends, cmds },
			}} />
		</main>
	)
}



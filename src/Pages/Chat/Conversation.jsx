import { useState } from 'react'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate } from 'react-router'
import ImageIcon from '../../components/ImageIcon'
import * as Menus from '../../components/Menus'
import * as Lists from '../../components/Lists'
import * as Textboxes from '../../components/Textboxes/Textboxes'
import ChatWindow from './ChatWindow'



export default function Conversation({props}) {
	const { chatSelect, selectChat, chatID } = props;

	const { uid, user, destroyCredentials, findFriends } = useUser();

	const {	socket,		toggleSocket,	messages,	setMessages,
			chats,		setChats, 		status, 	setStatus, 
			createChat,	findChat,		deleteChat,	renameChat,	 } = useChat();

	const navigate = useNavigate();

	let users = chatSelect ? findFriends(chatSelect?.users) : undefined;
	console.log("@Conversation. users:", chatSelect, users)
	const friends = user.profile?.friends || undefined;

	const newChat =()=> null;

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

	const handleSubmit = (input) => {
		const newMessage = { ...input, uid, session: (user?.session || socket.id) };
		setMessages(prev => [ ...prev, newMessage ]);

		//* DEV MODE //
		if (input.text==='/clear') {
			destroyCredentials(); 
			navigate('/');
			window.location.reload();
			return
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
		
	};


	return (
		<main id="Conversation">
			<header>
				<ImageIcon 
					src={user.profile.photo.url}
					role="profile-photo" 
					size="24px"
				/>
				<h1>
					{chatSelect?.name || "Select a Chat"}
				</h1>
				<Menus.Ellipses props={{
					name: 'chat-menu',
					'&new_chat': newChat,
					'&friends': ()=>navigate('/users/friends'),
					'&profile': ()=>navigate('/users/profile'),
					'&disconnect%connect': [socket, toggleSocket],
					'&delete': deleteChat,
					'&rename': renameChat,
				}} />
			</header>

			<ChatWindow props={{
				name: 'chats',
				messages, chatSelect,
				usersNames: users?.map(u => u?.displayname || '')
			}} />

			<Textboxes.SmartMessage props={{
				name: 'chat-input',
				onSubmit: handleSubmit,
				data: { chats, friends },
			}} />
		</main>
	)
}
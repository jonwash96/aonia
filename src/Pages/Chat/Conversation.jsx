import { useState } from 'react'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate } from 'react-router'
import ImageIcon from '../../components/ImageIcon'
import * as Menus from '../../components/Menus'
import * as Lists from '../../components/Lists'
import SmartTextbox from '../../components/Textboxes'
import ChatWindow from './ChatWindow'



export default function Conversation({props}) {
	const { uid, user, destroyCredentials, findFriends } = useUser();

	const {	socket,		toggleSocket,	appendMessage,
			chats,		setChats, 		chatSelect, 	selectChat, 
			createChat,	findChat,		deleteChat,		renameChat,	 } = useChat();

	const navigate = useNavigate();

	const users = chatSelect ? findFriends(chatSelect?.users) : undefined;
	const friends = user.profile?.friends || undefined;

	const newChat =()=> null;


	const handleSubmit = (input) => {
		//TODO:: Change this to pid not uid for clarity
		const newMessage = { ...input, uid: user.profile._id, session: (user?.session || socket.id), time: Date.now() };

		console.log("@handleSubmit. Send New Message:", chatSelect._id, newMessage);

		if (!input.text.startsWith('/') && chatSelect.temp) {
			const newChat = { ...chatSelect, messages: [ ...chatSelect.messages, newMessage ] };
			selectChat({ ...newChat, messages: [ ...chatSelect.messages, {text: "Creating new Chat. . ."} ]});
			console.log("@handleSubmit message. Creating new Chat...", newChat);
			return socket.emit('create-chat', uid, newChat);
		};

		//* DEV MODE //
		if (input.text==='/clear') {
			destroyCredentials(); 
			navigate('/login');
			window.location.reload();
			return
		};

		if (input.text.match(/^\/join user\s*\S+/gi)) 
			socket.emit('join-user', uid, input.text.match(/(?<=join\s?user\s)\S+/gi)[0])

		else if (input.text.match(/^\/join\s*\S+/gi)) 
			socket.emit('join-room', uid, input.text.match(/(?<=join\s)\S+/gi)[0])

		else if (input.text.match(/^\/leave\s*\S+/gi)) 
			socket.emit('leave-room', uid, input.text.match(/(?<=leave\s)\S+/gi)[0])

		else if (input.text.match(/^\/cmd\s\S+/gi)) 
			socket.emit('cmd', uid, input.text.match(/(?<=cmd\s)\S+/gi)[0])
		
		else if (input.text.match(/^\/broadcast\s\S+/gi)) 
			socket.emit('broadcast', uid, input.text.match(/(?<=broadcast\s).+/gi)[0])


		else {
			appendMessage(newMessage, chatSelect._id);
			socket.emit('send-message', uid, newMessage, chatSelect._id);
		};
	};


	return (
		<main id="Conversation">
			<header>
				<div>
					<ImageIcon 
						src={user.profile.photo.url}
						role="profile-photo" 
						size="24px"
					/>
				</div>
				<div>
					<h1>
						{chatSelect?.name || "Select a Chat"}
					</h1>
					<span>{chatSelect?._id || ''}</span>
				</div>
				<Menus.Ellipses props={{
					name: 'chat-menu',
					icon: 'c-ellipses',
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
				chatSelect, chats,
				usersNames: users?.map(u => u?.displayname || '')
			}} />

			<SmartTextbox type="Message" props={{
				name: 'chat-input',
				onSubmit: handleSubmit,
				data: { chats, friends },
			}} />
		</main>
	)
}
import { useNavigate } from 'react-router'
import { useEffect } from 'react';
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext';



export default function ChatWindow({props}) {
	const { name, messages, usersNames, chatSelect } = props;
	const { uid, user } = useUser();
	// const {	socket,	toggleSocket,	messages,	setMessages,
	// 		chats,	setChats, 		status, 	setStatus, 
	// 		deleteChat,	renameChat,	 } = useChat();
	
	const navigate = useNavigate();

	const bubbleColor = (message) => 
		message.text.startsWith('/')
			? 'cmd'
			: message.uid===uid ? 'user' : 'friend';



	return (
		<section id="ChatWindow" className={name || ''}>
			{!chatSelect && <h3>Select a Conversation</h3>}
			{chatSelect && chatSelect.messages.length <1 && <h3>Send a message to {usersNames}</h3>}

			{chatSelect && chatSelect.messages?.map((message,idx) => 
				<div key={idx} 
					 className={"bubble "+bubbleColor(message)} 
					 name={message.user}>

					{message.text}<br/>

					<small>
						User: {message.uid}<br/>
						UID: {uid}<br/>
						Session: {message.session}
					</small>

				</div>
			)}
		</section>
	)
}
import { useNavigate } from 'react-router'
import { useEffect } from 'react';
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext';



export default function ChatWindow({props}) {
	// const { name, messages, chats } = props;
	const { uid, user } = useUser();
	const {	socket,	toggleSocket,	messages,	setMessages,
				chats,	setChats, 		status, 	setStatus, 
				deleteChat,	renameChat,	 } = useChat();
	
	const navigate = useNavigate();

	const bubbleColor = (message) => 
		message.text.startsWith('/')
			? 'cmd'
			: message.uid===uid ? 'user' : 'friend';
			
	useEffect(() => {
		console.log(messages)
	},[messages])


	// if (!chats || chats.length === 0) return (
	// 	<section id="ChatWindow">
	// 		<h3>Start a Chat</h3>
	// 	</section>
	// )

	return (
		<section id="ChatWindow" className={name || ''}>
			{messages?.length === 0 && <h3>Select a Message</h3>}

			{messages?.map((message,idx) => 
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
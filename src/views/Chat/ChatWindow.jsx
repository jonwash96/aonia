import { useNavigate } from 'react-router'



export default function ChatWindow({ name, messages, chats }) {
	const navigate = useNavigate();

	const bubbleColor = (message) => 
		message.text.startsWith('/')
			? 'cmd'
			: message.uid===uid ? 'user' : 'friend';

	
	if (!chats || chats.length === 0) return (
		<section id="ChatWindow">
			<h3>Start a Chat</h3>
		</section>
	)

	else return (
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
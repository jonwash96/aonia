import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import useUser from '../../contexts/userContext'
import '../../utils/bancroft-proto'



export default function ChatWindow({props}) {
	const { name, usersNames, chatSelect, chats } = props;
	const { uid, user } = useUser();
	
	const navigate = useNavigate();

	const bubbleColor = (message) => 
		message.text.startsWith('/')
			? 'cmd'
			: message.uid===user.profile._id ? 'user' : 'friend';



	return (
		<section id="ChatWindow" className={name || ''}>
			{!chatSelect && <h3>Select a Conversation</h3>}
			{chatSelect && chatSelect.messages.length <1 && <h3>Send a message to {usersNames}</h3>}

			{chatSelect && chats[chatSelect._id]?.messages?.map((message,idx) => 
				<div key={idx} 
					 className={"bubble "+bubbleColor(message)} 
					 name={message.user}>

					{message.text}<br/>
					{message.text.startsWith('/eval') && <b>{eval(message.text.slice(5))}<br/></b>}

					<small>
						<b>UserProfile (uid):</b> {message.uid || '--'}<br/>
						<b>UID:</b> {uid || '--'}<br/>
						<b>Session:</b> {message.session || '--'}<br/>
						<i>{message.time._epochTo('recent') || '--'}</i>
					</small>

				</div>
			)}
		</section>
	)
}
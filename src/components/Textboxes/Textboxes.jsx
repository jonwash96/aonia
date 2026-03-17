import { useState } from 'react'
import ImageIcon from '../ImageIcon';
import RecursiveMap from '../RecursiveMap';
import './Textboxes.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import * as userService from '../../services/userService'



export function Search({props}) {
	const { name, onSubmit, data, icon, button } = props;

	const { uid, user, getNotifications } = useUser();

	const {	socket,		toggleSocket,	appendMessage,
			chats,		setChats, 		chatSelect, 	selectChat, 
			createChat,	findChat,		deleteChat,		renameChat,	 } = useChat();


	const defaultState = { text: '', color: 'inherit' };
	const [input, setInput] = useState(defaultState);
	const [cmdHistory, setCmdHistory] = useState([]);
	const [suggestionVis, setSuggestionViz] = useState('');

	let filteredData = [];
	const fuzzySpaces = (term) => term.replaceAll(' ', '.+');

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
		}
	};

	const handleChange = (e) => {
		const et = e.target;
		const inputColor = et.value.startsWith('/') ? '#0bf' : 'inherit';
		setInput(prev => ({ ...prev, [et.name]: et.value, color: inputColor }));
	};

	const handleCMD = (text) => {
		if (text.startsWith('/')) return onSubmit({ ...input, text });
		if (text.startsWith('eval')) eval(text.slice(5));
		if (text.startsWith('log')) console.log(eval(text.slice(4)));
		if (text.startsWith('notif')) getNotifications();
		if (text.startsWith('addf')) userService.sendFriendRequest (
			{
				user_id: uid,
				profile_id: user.profile._id,
				requested_id: text.split(' ')[2],
				requested_username: text.split(' ')[2],
				username: user.username,
				displayname: user.displayname,
				method: text.split(' ')[1]
			}	
		);
		if (text.startsWith('resf')) userService.respondFriendRequest (
			{
				user_id: uid,
				profile_id: user.profile._id,
				requestor_id: text.split(' ')[1],
				username: user.username,
				displayname: user.displayname,
				response: {
					recipientActivityID: text.split(' ')[2],
					senderActivityID: text.split(' ')[3],
					choice: text.split(' ')[4] || "accepted"
				}
		}	);
		if (text.startsWith('fres')) {
			const notif = user.notifications.at(-1).activityID;
			if (!notif.category === 'friend-request') return console.warn("@Friend Request Response notification not set")
			userService.respondFriendRequest (
			{
				user_id: uid,
				profile_id: user.profile._id,
				requestor_id: notif.data.senderProfileID,
				username: user.username,
				displayname: user.displayname,
				response: {
					recipientActivityID: notif._id,
					senderActivityID: notif.data.senderActivityID,
					choice: text.split(' ')[1] || "accepted"
				}
			}
		)};
	};

	const clear =()=> setInput(defaultState);

	const validateSubmit = (e) => {
		e.preventDefault();
		if (input.text === '') return console.log("No input");
		
		if (input.text.startsWith('/')) {
			setCmdHistory(prev => [ ...prev, { 
				...input, 
				prevNode: cmdHistory.length === 0 ? 0 : cmdHistory.length -1, 
				nextNode: cmdHistory.length +1 } ]);

			return handleCMD(input.text.slice(1));
		};

		const validated = input;
		onSubmit(validated);
		return clear();
	};



	return (
		<section className={name+" Search"}>
			<form onSubmit={validateSubmit} className={name+'-form'}>
				<input 
					onChange={handleChange} 
					onFocus={()=>setSuggestionViz('open')}
					onBlur={()=>setSuggestionViz('')}
					value={input.text}
					name="text"
					type="search" 
					placeholder="Search" 
					style={{color: input.color || 'inherit'}}
					onKeyDown={handleKeys}
					autoComplete="off"
				/>

				{icon && (
				<ImageIcon 
					content={icon.content || "🔍"} 
					size={icon.size || '.6em'}
					onClick={validateSubmit}
				/>)}

			</form>

			{data && (
				<div className={name+'-search-suggestions search-suggestions '+suggestionVis}>
					{data.length === 0 
						? <em>Type to Search for users & chats. . .</em>
						: <RecursiveMap parent={{ ...data, command_history: [...cmdHistory, 'dummy1', {dummy2: ['a', 'b']}] }} /> }
				</div>
			)}
		</section>
	)
}




export function SmartMessage({props}) {
	const { name, onChange, onSubmit, onClear, data } = props;
	const defaultState = { text: '', files: [], color: 'inherit' };
	const [input, setInput] = useState(defaultState);
	const [cmdHistory, setCmdHistory] = useState([]);

	const {	socket,		toggleSocket,	appendMessage,
			chats,		setChats, 		chatSelect, 	selectChat, 
			createChat,	findChat,		deleteChat,		renameChat,	 } = useChat();

	
	const { uid, user } = useUser();
	
	const clear =()=> setInput(defaultState);

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
		}
	};

	const handleChange = (e) => {
		const et = e.target;
		const inputColor = et.value.startsWith('/') ? '#0bf' : 'inherit';
		setInput(prev => ({ ...prev, [et.name]: et.value, color: inputColor }));
	};

	const handleCMD = (text) => {
		setCmdHistory (prev => [ ...prev, { 
			...input, 
			prevNode: cmdHistory.length === 0 ? 0 : cmdHistory.length -1, 
			nextNode: cmdHistory.length +1 } ])

		if (text.startsWith('/')) return onSubmit({ ...input, text });
		if (text.startsWith('eval')) eval(text.slice(5));
		if (text.startsWith('log')) console.log(eval(text.slice(4)));

		appendMessage (
			{ ...input, uid: user.profile._id, session: (user?.session || socket.id), time: Date.now() }, 
			chatSelect._id
		);

		return text.match(/\$$/) && clear();
	};

	const validateSubmit = (e) => {
		e.preventDefault();
		if (input.text === '') return console.log("No input");

		if (input.color === '#0bf') return handleCMD(input.text.slice(1));

		else onSubmit(input);
		return clear();
	};


	return (
		<section className={name+" SmartMessage"}>
			<form onSubmit={validateSubmit}>

				<div className="uploads">
					<input id="file-upload" type="file" name="files" onChange={onChange} />
				</div>

				<div className="input">
					<label htmlFor="file-upload" className="c-flex clickable">➕</label>
					
					<input type="text" 
						name="text" 
						value={input.text} 
						onChange={onChange || handleChange} 
						style={{color: input.color || 'inherit'}}
						onKeyDown={handleKeys}
						placeholder="Your Message. . ."
						autoComplete="off"
					/>
					
					<button type="button" onClick={onClear || clear}>❌</button>
					<button type="submit">➣</button>
				</div>
				
			</form>
		</section>
	)
}
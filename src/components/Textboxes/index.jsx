import { useState, useContext, createContext } from 'react'
import ImageIcon from '../ImageIcon';
import RecursiveMap from '../RecursiveMap';
import './Textboxes.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import * as userService from '../../services/userService'


export default function SmartTextbox({ type, props }) {
	switch (type) {
		case 'Search': return (
			<SmartTextboxProvider>
					<SmartSearch props={props}/>
			</SmartTextboxProvider>
		); break;

		case 'Message': return (
			<SmartTextboxProvider>
					<SmartMessage props={props}/>
			</SmartTextboxProvider>
		); break;
	}
}



const SmartTextboxContext = createContext();


export function SmartTextboxProvider({ children }) {
	const { uid, user,	setUser,		storeUser,
			authToken, 	setAuthToken,	destroyCredentials,
			JITAuth,	findFriends,	getNotifications, } = useUser();

	const { socket, 	toggleSocket,	appendMessage,
			chats, 		setChats,		chatSelect, 	selectChat,
			status, 	setStatus,		createChat,		findChat,
			deleteChat, renameChat } = useChat();


	const DF =()=> console.warn("Submit handler not defined.");

	const fuzzySpaces = (term) => term.replaceAll(' ', '.+');

	const handleKeys = (e, input, setInputHandler, cmdHistory, defaultState) => {
		if (input.text.startsWith('/') || input.text === '') {
			if (e.key === 'ArrowUp') {
				e.preventDefault();
				if ('prevNode' in input) setInputHandler(cmdHistory.at(input.prevNode))
				else if (cmdHistory.length > 0) setInputHandler(cmdHistory.at(-1));
			}
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				if ('nextNode' in input && cmdHistory.length > input.nextNode)
					setInputHandler(cmdHistory.at(input.nextNode))
				else if ('nextNode' in input && cmdHistory.length === input.nextNode)
					setInputHandler(defaultState)
			}
		}
	};

	const handleChange = (e, setInputHandler) => {
		const et = e.target;
		const inputColor = et.value.startsWith('/') ? '#0bf' : 'inherit';
		setInputHandler(prev => ({ ...prev, [et.name]: et.value, color: inputColor }));
	};

	const handleCMD = (input, onSubmitHandler, clear) => {
		let text = input.text.slice(1);
		let clr; if (text.at(-1) === '$') {clr = true; text = text.replace(/\$$/g, '')};

		if (text.startsWith('/')) return onSubmitHandler({ ...input, text })
		else if (text.startsWith('eval')) eval(text.slice(5))
		else if (text.startsWith('log')) console.log(eval(text.slice(4)))
		else if (text.startsWith('notif')) getNotifications()
		else if (text.startsWith('addf')) userService.sendFriendRequest (
			{
				user_id: uid,
				profile_id: user.profile._id,
				requested_id: text.split(' ')[2],
				requested_username: text.split(' ')[2],
				username: user.username,
				displayname: user.displayname,
				method: text.split(' ')[1]
			}	
		)
		else if (text.startsWith('resf')) userService.respondFriendRequest (
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
		}	)
		else if (text.startsWith('fres')) {
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
			}	}
		)}
		else onSubmitHandler({ ...input, text });

		return clr ? clear() : undefined
	};

	const validateSubmit = (e, input, onSubmitHandler=DF, cmdHistory, setCmdHistory, clear) => {
		e.preventDefault();
		if (input.text === '') return console.log("No input");
		
		if (input.text.startsWith('/')) {
			setCmdHistory(prev => [ ...prev, { 
				...input, 
				prevNode: cmdHistory.length === 0 ? 0 : cmdHistory.length -1, 
				nextNode: cmdHistory.length +1 } ]);

			return handleCMD(input, onSubmitHandler, clear);
		};

		onSubmitHandler(input);
		return clear ? clear() : undefined;
	};


	const TCX = { fuzzySpaces,  handleKeys,		handleChange,
				  handleCMD,	validateSubmit };

	return (
		<SmartTextboxContext.Provider value={ TCX }>
			{children}
		</SmartTextboxContext.Provider>
	)
}



export function SmartSearch({props}) {
	const { name, value, setValue, onChange, onKeyDown, onSubmit, data, icon, placeholder, autocomplete } = props;
	const defaultState = { text: '', color: 'inherit' };
	const [input, setInput] = useState(defaultState);
	const [cmdHistory, setCmdHistory] = useState([]);
	const [suggestionVis, setSuggestionViz] = useState('');
	let filteredData = [];
	const clear =()=> setInput(defaultState);

	const _input = value || input;
	const _setInput = setValue || setInput;

	const TCX = useContext(SmartTextboxContext);
	const handleKeys = (e) => onKeyDown ? onKeyDown(e) : TCX.handleKeys(e, _input, _setInput, cmdHistory, defaultState);
	const handleChange = (e) => onChange ? onChange(e) : TCX.handleChange(e, _setInput);
	const validateSubmit = (e) => TCX.validateSubmit(e, _input, onSubmit, cmdHistory, setCmdHistory, clear);

	return (
		<section className={name+" Search"}>
			<form onSubmit={validateSubmit}>
				<input type="search" 
					name="text"
					onChange={onChange || handleChange} 
					onFocus={()=>setSuggestionViz('open')}
					onBlur={()=>setSuggestionViz('')}
					value={_input.text}
					placeholder={placeholder || "Search" }
					style={{color: _input.color || 'inherit'}}
					onKeyDown={handleKeys}
					autoComplete={autocomplete || "off"}
				/>

				{icon && (
				<ImageIcon 
					content={icon?.content || "🔍"} 
					size={icon?.size || '.6em'}
					onClick={validateSubmit}
				/>)}

			</form>

			{data && (
				<div className={name+'-search-suggestions search-suggestions '+suggestionVis}>
					{data.length === 0 
						? <em>Type to Search for users & chats. . .</em>
						: <RecursiveMap parent={{ ...props.data, command_history: [...cmdHistory, 'dummy1', {dummy2: ['a', 'b']}] }} /> }
				</div>
			)}
		</section>
	)
}


export function SmartMessage({props}) {
	const { name, value, setValue, onChange, onSubmit, onKeyDown, onClear, data, placeholder, autocomplete } = props;
	const defaultState = { text: '', color: 'inherit' };
	const [input, setInput] = useState(defaultState);
	const [cmdHistory, setCmdHistory] = useState([]);
	const clear =()=> setInput(defaultState);
	
	const _input = value || input;
	const _setInput = setValue || setInput;

	const TCX = useContext(SmartTextboxContext);
	const handleKeys = (e) => onKeyDown ? onKeyDown(e) : TCX.handleKeys(e, _input, _setInput, cmdHistory, defaultState);
	const handleChange = (e) => onChange ? onChange(e) : TCX.handleChange(e, _setInput);
	const validateSubmit = (e) => TCX.validateSubmit(e, _input, onSubmit, cmdHistory, setCmdHistory, clear);


	return (
		<section className={name+" SmartMessage"}>
			<form onSubmit={validateSubmit}>

				<div className="uploads">
					<input id="file-upload" type="file" name="files" onChange={handleChange} />
				</div>

				<div className="input">
					<label htmlFor="file-upload" className="c-flex clickable">➕</label>
					
					<input type="text" 
						name="text" 
						value={_input.text} 
						onChange={onChange || handleChange} 
						style={{color: _input.color || 'inherit'}}
						onKeyDown={handleKeys}
						placeholder={placeholder || "Your Message. . ."}
						autoComplete={autocomplete || "off"}
					/>
					
					<button type="button" onClick={onClear || clear}>❌</button>
					<button type="submit">➣</button>
				</div>
				
			</form>
		</section>
	)
}
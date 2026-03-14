import { useState } from 'react'
import ImageIcon from '../ImageIcon';
import RecursiveMap from '../RecursiveMap';
import './Textboxes.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'



export function Search({props}) {
	const { name, onSubmit, data, icon, button } = props;

	const { uid, user } = useUser();
	
	const {	socket,	toggleSocket,	messages,	setMessages,
			chats,	setChats, 		status, 	setStatus, 
			deleteChat,	renameChat,	 } = useChat();


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
		if (text.startsWith('eval')) eval(text.slice(5));
		if (text.startsWith('log')) console.log(eval(text.slice(4)));
	};

	const clear =()=> setInput(defaultState);

	const validateSubmit = (e) => {
		// e.preventdefault();
		if (input.text === '') return console.log("No input");
		
		if (input.text.startsWith('/')) {
			setCmdHistory(prev => [ ...prev, { 
				...input, 
				prevNode: cmdHistory.length === 0 ? 0 : cmdHistory.length -1, 
				nextNode: cmdHistory.length +1 } ])
		};

		const validated = input;
		if (input.color === '#0bf') return handleCMD(input.text.slice(1));
		else onSubmit(validated);
		return clear();
	};



	return (
		<section className={name+" Search"}>
			<form action={validateSubmit} className={name+'-form'}>
				<input 
					onChange={handleChange} 
					onFocus={()=>setSuggestionViz('open')}
					onBlur={()=>setSuggestionViz('')}
					value={input.text}
					name="text"
					type="search" 
					style={{color: input.color || 'inherit'}}
					placeholder="Search" 
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
	const { name, onChange, onSubmit, onClear, data} = props;
	const defaultState = { text: '', files: [], color: 'inherit' };
	const [input, setInput] = useState(defaultState);
	const [cmdHistory, setCmdHistory] = useState([]);

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

	const clear =()=> setInput(defaultState);

	const validateSubmit = (e) => {
		// e.preventdefault();
		if (input.text === '') return console.log("No input");

		if (input.text.startsWith('/')) {
			setCmdHistory(prev => [ ...prev, { 
				...newMessage, 
				prevNode: cmdHistory.length === 0 ? 0 : cmdHistory.length -1, 
				nextNode: cmdHistory.length +1 } ])
		};
		
		const validated = input;
		onSubmit(validated);
		return clear();
	};


	return (
		<section className={name+" SmartMessage"}>
			<form onSubmit={validateSubmit}>

				<div className="upload">
					<input type="file" name="files" onChange={onChange} />
				</div>

				<div className="input">
					<input type="text" 
						name="text" 
						value={input.text} 
						onChange={onChange || handleChange} 
						style={{color: input.color || 'inherit'}}
						onKeyDown={handleKeys}
						autoComplete="off"
					/>
					
					<button type="button" onClick={onClear}>❌</button>
					<button type="submit">➣</button>
				</div>
				
			</form>
		</section>
	)
}
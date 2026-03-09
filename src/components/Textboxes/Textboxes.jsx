import { useState } from 'react'
import ImageIcon from '../ImageIcon';
import RecursiveMap from '../RecursiveMap';
import './Textboxes.css'

const time = [
	'2026-03-07 00:00', '2026-03-07 01:00', '2026-03-07 02:00',
	'2026-03-07 03:00', '2026-03-07 04:00', '2026-03-07 05:00',
	'2026-03-07 06:00', '2026-03-07 07:00', '2026-03-07 08:00',
	'2026-03-07 09:00', '2026-03-07 10:00', '2026-03-07 11:00',
	'2026-03-07 12:00', '2026-03-07 13:00', '2026-03-07 14:00',
	'2026-03-07 15:00', '2026-03-07 16:00', '2026-03-07 17:00',
	'2026-03-07 18:00', '2026-03-07 19:00', '2026-03-07 20:00',
	'2026-03-07 21:00', '2026-03-07 22:00', '2026-03-07 23:00',
	'2026-03-08 00:00', '2026-03-08 01:00', '2026-03-08 02:00',
	'2026-03-08 03:00', '2026-03-08 04:00', '2026-03-08 05:00',
	'2026-03-08 06:00', '2026-03-08 07:00', '2026-03-08 08:00',
	'2026-03-08 09:00', '2026-03-08 10:00', '2026-03-08 11:00',
	'2026-03-08 12:00', '2026-03-08 13:00', '2026-03-08 14:00',
	'2026-03-08 15:00', '2026-03-08 16:00', '2026-03-08 17:00',
	'2026-03-08 18:00', '2026-03-08 19:00', '2026-03-08 20:00',
	'2026-03-08 21:00', '2026-03-08 22:00', '2026-03-08 23:00',
	'2026-03-09 00:00', '2026-03-09 01:00', '2026-03-09 02:00',
	'2026-03-09 03:00', '2026-03-09 04:00', '2026-03-09 05:00',
	'2026-03-09 06:00', '2026-03-09 07:00', '2026-03-09 08:00',
	'2026-03-09 09:00', '2026-03-09 10:00', '2026-03-09 11:00',
	'2026-03-09 12:00', '2026-03-09 13:00', '2026-03-09 14:00',
	'2026-03-09 15:00', '2026-03-09 16:00', '2026-03-09 17:00',
	'2026-03-09 18:00', '2026-03-09 19:00', '2026-03-09 20:00',
	'2026-03-09 21:00', '2026-03-09 22:00', '2026-03-09 23:00',
	'2026-03-10 00:00', '2026-03-10 01:00', '2026-03-10 02:00',
	'2026-03-10 03:00', '2026-03-10 04:00', '2026-03-10 05:00',
	'2026-03-10 06:00', '2026-03-10 07:00', '2026-03-10 08:00',
	'2026-03-10 09:00', '2026-03-10 10:00', '2026-03-10 11:00',
	'2026-03-10 12:00', '2026-03-10 13:00', '2026-03-10 14:00',
	'2026-03-10 15:00', '2026-03-10 16:00', '2026-03-10 17:00',
	'2026-03-10 18:00', '2026-03-10 19:00', '2026-03-10 20:00',
	'2026-03-10 21:00', '2026-03-10 22:00', '2026-03-10 23:00',
	'2026-03-11 00:00', '2026-03-11 01:00', '2026-03-11 02:00',
	'2026-03-11 03:00',
  ]

export function Search({props}) {
	const { name, onSubmit, data, icon, button } = props;
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

	const clear =()=> setInput(defaultState);

	const validateSubmit = (e) => {
		e.preventDefault();
		if (input.text === '') return console.log("No input");
		console.log(input);
		const validated = input;
		onSubmit(validated);
		return clear();
	};

	return (
		<section className={name+" Search"}>
			<form action={validateSubmit} className={name+'-form'}>
				<input 
					onChange={handleChange} 
					onFocus={()=>setSuggestionViz('open')}
					onBlur={()=>setSuggestionViz('')}
					value={input.search}
					name="search"
					type="search" 
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
						: <RecursiveMap parent={data} /> }
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
		e.preventDefault();
		if (input.text === '') return console.log("No input");

		if (input.text.startsWith('/')) {
			setCmdHistory(prev => [ ...prev, { 
				...newMessage, 
				prevNode: cmdHistory.length === 0 ? 0 : cmdHistory.length -1, 
				nextNode: cmdHistory.length +1 } ])
		};
		
		console.log(input);
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
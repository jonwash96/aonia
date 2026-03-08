import { useState } from 'react'
import ImageIcon from './ImageIcon';
import RecursiveMap from './RecursiveMap';



export function Search({props}) {
	const { name, onSubmit, data, icon, button } = props;
	const defaultState = { text: '', color: 'inherit' };
	const [input, setInput] = useState(defaultState);
	const [cmdHistory, setCmdHistory] = useState([]);

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
		<div className={name+" Search"}>
			<form action={onSubmit} className={name+'-form'}>
				{icon && (
				<ImageIcon 
					content={icon.content || "🔍"} 
					size={icon.size || '.6em'}
				/>)}

				<input 
					onChange={handleChange} 
					value="search"
					name={input.search}
					type="search" 
					placeholder="Search" 
				/>

				{button && (
				<button type="submit">
					{button.text || "🔍"}
				</button>
				)}
			</form>

			{data && (
				<div className={name+'-search-suggestions search-suggestions'}>
					<RecursiveMap parent={data} />
				</div>
			)}
		</div>
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
export function Search(props) {
	const { name, input, onChange, onSubmit, data, icon, button } = props;

	let filteredData = [];
	const fuzzySpaces = (term) => term.replaceAll(' ', '.+');
	
	const handleChange = (e) => {
		const regex = new RegExp(e.target.value, 'ig');
		filteredData = data.filter(datum => datum.match(regex));
		onChange(e);
	}

	return (
		<div className={name}>
			<form action={onSubmit} className={name+'-form'}>
				{icon && (
				<ImageIcon 
					content={icon.content || "🔍"} 
					size={icon.size || '.6em'}
				/>)}

				<input 
					onChange={handleChange} 
					value={input[name+'_search']} 
					name={name+'_search'} 
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


export function SmartMessage({ name, input, onChange, onSubmit, onClear, data }) {
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

	const clear = () => setInput(defaultState);

	const validateSubmit = (e) => {
		e.preventDefault();
		if (input.text === '') return console.log("No input");
		console.log(input);
		const validated = input;
		return onSubmit(validated);
	};

	return (
		<section className={name+" SmartMessage"}>
			<form onSubmit={onSubmit}>
				<div className="upload">
					<input type="file" name="files" onChange={onChange} />
				</div>
				<div className="input">
					<input type="text" name="text" 
						onChange={onChange} 
						style={{color: input.color}}
						value={input.text}
						onKeyDown={handleKeys}
						autoComplete="off"
					/>
					<button type="button" onClick={clear}>❌</button>
					<button type="submit">➣</button>
				</div>
			</form>
		</section>
	)
}
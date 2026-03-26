import { useState } from 'react'
import ImageIcon from '../ImageIcon'
import RecursiveMap from '../RecursiveMap'
import './index.css'
import useSmartTextboxCore from './core'



export default function SmartTextbox({ type, props }) {
	switch (type) {
		case 'Search': return (
			<SmartSearch props={props}/>
		); break;

		case 'Message': return (
			<SmartMessage props={props}/>
		); break;
	}
}



export function SmartSearch({props}) {
	const { name, 		value, 		setValue, 	onChange, 
			onKeyDown, 	onSubmit, 	data, 		icon, 
			placeholder, 			autocomplete } = props;
	
	const { input, 
			handleChange, handleKeys, 
			validateSubmit 
		} = useSmartTextboxCore({ 
			value, setValue,
			onSubmit, onChange, onKeyDown, 
			defaultState: { text: '', color: 'inherit' }
	});

	const [suggestionVis, setSuggestionViz] = useState('');
	let filteredData = [];


	return (
		<section className={name+" SmartSearch SmartTextbox"}>
			<form onSubmit={validateSubmit}>
				<input type="search" 
					name="text"
					onChange={onChange || handleChange} 
					onFocus={()=>setSuggestionViz('open')}
					onBlur={()=>setSuggestionViz('')}
					value={input.text}
					placeholder={placeholder || "Search" }
					style={{color: input.color || 'inherit'}}
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
	const { name, 		value, 		setValue, 	onChange, 
			onKeyDown, 	onSubmit, 	data, 		icon, 
			placeholder, 			autocomplete } = props;
	
	const { input, clear,
			handleChange, handleKeys, 
			validateSubmit 
		} = useSmartTextboxCore({ 
			value, setValue,
			onSubmit, onChange, onKeyDown, 
			defaultState: { text: '', color: 'inherit' }
	});
	

	return (
		<section className={name+" SmartMessage  SmartTextbox"}>
			<form onSubmit={validateSubmit}>

				<div className="uploads">
					<input id="file-upload" type="file" name="files" onChange={handleChange} />
				</div>

				<div className="input">
					<label htmlFor="file-upload" className="c-flex clickable">➕</label>
					
					<input type="text" 
						name="text" 
						value={input.text} 
						onChange={onChange || handleChange} 
						style={{color: input.color || 'inherit'}}
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
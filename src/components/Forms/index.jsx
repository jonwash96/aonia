import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import typecheck from '../../utils/tc'
import handleJSONResponse from '../../utils/handleJSONResponse'
import resolveConfig from './resolveConfig'



function BasicForm({props}) {
	const { name, title, form, options } = props;

	return (
		<div className={name+" BasicForm"}>
			<h1>{title}</h1>
			<form>
				{form.map((el,idx) => (
					<div key={el.name || idx}>
						{el.headding && <h2>{el.headding}</h2>}

						{el.label && <label 
							htmlFor={el.id}
							style={el.label?.style || ''}>
								{el.label?.text}
						</label>}

						{el.input && <input className={el.name || el.id}
							type={el.input?.type}
							id={el.id}
							name={el.name || el.id}
							value={_input[el.id]}
							style={el.input?.style}
							onFocus={el.input?.onFocus || ''}
							onBlur={el.input?.onBlur || ''}
							placeholder={el.input?.placeholder || '' }
							autoComplete={el.input?.autocomplete || "off"}
							required={el.input?.required || false}
						/>}

						{el.select && <select className={el.name || el.id}
							type={el.select?.type}
							id={el.id}
							name={el.name || el.id}
							style={el.select?.style}
							onFocus={el.select?.onFocus || ''}
							onBlur={el.select?.onBlur || ''}>
								{el.select?.options?.map(option => 
									{option.includes('%')
										? <option id={option.split('%')[0]}>{ option.split('%')[1].replace('_', ' ')._toTitleCase() }</option>
										: <option id={option}>{option.replace('_', ' ')._toTitleCase()}</option>
									}
								)}
						</select>}

						{el.textarea && <textarea className={el.name || el.id}
							type={el.select?.type}
							id={el.id}
							name={el.name || el.id}
							style={el.select?.style}
							onFocus={el.select?.onFocus || ''}
							onBlur={el.select?.onBlur || ''}>
								{_input[el.id]}
						</textarea>}
					</div>
				))}	
				<div className="btn-block">
					{options.cancelBtn && <button type="button" onClick={options.cancelBtn}>Cancel</button>}
					<button type="submit" onClick={options.submit?.onClick}>{options.submit?.text || "Submit"}</button>
				</div>
			</form>
		</div>
	)
}


async function handleDefaultSubmit(url, auth, formData, cb) {
	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: { 
				"Content-Type": "application/json",
				"Authorization": `${auth ? 'Bearer '+localStorage.getItem('aonia-token') : ''}`
			},
			body: JSON.stringify(formData)
		});

		res.ok && console.log("Form Data Sent");
		cb(null, await handleJSONResponse(res));

	} catch (err) {
		console.error(err);
		cb(err);
	}
}


export function QuickForm({ config, recompile }) {
	const { name,	title,		items,		cancelBtn,	
			type, 	onSubmit, 	onChange, 	submitBtn } = config;

	const [input, setInput] = useState();
	const [viewForm, setViewForm] = useState(true);
	const handleChange = useCallback((e) => {
		setInput(prev => ({ ...prev, [e.target.id]: e.target.value }));
	},[]);

	const onChangeRef = useRef(onChange);
	useEffect(() => onChangeRef.current = onChange, [onChange]);
	const _onChange = useCallback((e)=> onChangeRef.current(e),[]);


	const resData = useMemo(() => 
		resolveConfig(config, { handleChange, _onChange }), 
	[recompile]);

	useEffect(() => {
		if (!input) setInput(resData.input)
	},[resData]);


	const handleSubmit = useCallback((e) => {
		e.preventDefault();

		if (typecheck(onSubmit, 'object-literal')) {
			handleDefaultSubmit (
				onSubmit.url, 
				onSubmit.auth || null, 
				input,
				onSubmit.callback || null
			);
			setViewForm(false);
		} else if (typecheck(onSubmit, 'function')) {
			return onSubmit(input)
		}
	},[onSubmit]);

	const inputTypes = [
		'text',		'checkbox',		'radio',	'color',
		'date',		'email',		'hidden',	'month',
		'number', 	'password',		'search',	'tel',
		'file',		'time',			'week',		'range',
		'image',	'datetime-local'
	];


	if (!input) return <p>Loading. . .</p>
	return viewForm === true ? (
		<div className={name+" QuickForm"} id={name}>
			{title && <h1>{title}</h1>}
			<form onSubmit={handleSubmit}>
				{resData.items.map(item => {
					return (
						<div key={item.id}>
						{item.heading && <h2>{item.heading}</h2>}

						{item.label && <label 
							htmlFor={item.id}>
								{item.label}
						</label>}

						{inputTypes.includes(item.type) && <input className={item.name}
							type={item.type}
							id={item.id}
							name={item.name}
							value={input[item.id]}
							onChange={item.onChange}
							style={item.style}
							onFocus={item.onFocus}
							onBlur={item.onBlur}
							placeholder={item.placeholder}
							autoComplete={item.autocomplete}
							required={item.required}
						/>}

						{item.type === 'select' && <select className={item.name}
							id={item.id}
							name={item.name}
							value={input[item.id]}
							style={item.style}
							onChange={item.onChange}
							onFocus={item.onFocus}
							onBlur={item.onBlur}>
								{item.listOptions.map(li =>
									<option value={!li.startsWith('--') ? li : ''}>
										{li._toTitleCase('_')}
									</option>
								)}
						</select>}

						{item.type === 'textarea' && <textarea className={item.name}
							id={item.id}
							name={item.name}
							value={input[item.id]}
							style={item.style}
							onChange={item.onChange}
							onFocus={item.onFocus}
							onBlur={item.onBlur}
						/>}
					</div>
				)})}	
				<div className="btn-block">
					{cancelBtn && <button type="button" onClick={cancelBtn}>
						Cancel
					</button>}
					<button type="submit" onClick={submitBtn?.onClick || null}>
						{submitBtn?.text || "Submit"}
					</button>
				</div>
			</form>
		</div>

	) : (
		<FormResponseView props={typecheck(onSubmit, 'object-literal') ? onSubmit : null} />
	)
}


function FormResponseView({props}) {
	const { statusMessage, url, cb } = props;
	return (
	<div className="default-submit-modal">
		<h1>{statusMessage || "Form Submitted Successfully!"}</h1>
		<a href={url}><button onClick={cb}>Done</button></a>
	</div>
	)
}
import typecheck from '../../utils/tc'



export default function resolveConfig (config, local) {
	let { 	name, 		type, 		types, 		items, 		names, 
			ids, 		labels, 	headings, 	placeholders, 
			onBlur, 	onChange,	onFocus,	required,	blacklist,
			fields,		options,	maxDepth,	autocomplete } = config;
		
	const { handleChange, _onChange } = local;

	const badConfigErr = new Error("QuickForm Error! Improper configuration. Please reference the documbentation for the correct input format.");
	
	const badTypeErr = (propName, types, id, check, abort=false) => {
		const err = new Error(`QuickForm Error! "${propName}" must be of type ${types} for id: ${id}, but got: ${check}`);
		if (!abort) {console.error(err); return null
		} else throw err;
	};
	
	const handleFallback = (item, prop, global, gName, fallback) => {
		if (prop === false || global === false) return null;
		const handleByType = (which) => 
			typeof which === 'function'
				? which(item, config)
				: typeof which === 'string'
					? which 
					: Array.isArray(which)
						? which[item.idx]
						: badTypeErr(gName || global, 'function or string', v.id, typecheck(which))
		;
		if (prop) return handleByType(prop)
		else if (global) return handleByType(global)
		else return fallback || null
	};

	// Initialize Defaults
	name = name || 'newForm';
	type = type?.toLowerCase() || 'text';
	ids = ids || name+'-item-';
	headings = handleFallback(null, null, headings, 'Headings')

	const baseSchema = { type, ids, name, items: [], input: {} };

	const itemSchema = (idx, key, v) => ({
		id: v.id || ids+idx,
		name: v.name || key,
		type: handleFallback({...v, idx, key}, v.type, types, 'Types', type) || 'text',
		style: v.style || null,
		label: handleFallback({ ...v, idx, key}, v.label, labels, 'Labels', key),
		listOptions: v.listOptions || null,
		onChange: v.onChange || _onChange || handleChange,
		onFocus: v.onFocus && v.onFocus === false ? null : onFocus || null,
		onBlur: v.onBlur && v.onBlur === false ? null : onBlur || null,
		placeholder: handleFallback({ ...v, idx, key}, v.placeholder, placeholders, 'Placeholders'),
		autocomplete: handleFallback({ ...v, idx, key}, v.autocomplete, autocomplete, 'Autocomplete', "off"),
		required: handleFallback({ ...v, idx, key}, v.required, required, 'Required', false),
		heading: handleFallback({ ...v, idx, key}, v.heading, headings, 'Headings')
	});


	function createSpecifiedNumber() {
		// Create a new form with <items:Number>
		for (let idx=0; idx<items; idx++) {
			baseSchema.items.push (
				itemSchema(idx, null, {
					id: ids+idx,
					name: names || name+'-item',
					type: type.toLowerCase(),
			}) )
		};
		return baseSchema;
	}

	function hydrateFromItemsWithConfigAndDefaults() {
		// Generate a form, populating inputs from items
		// By Default, each item gets flat mapped

		const flatMap = (entries, idx=0, level=1) => {
			const [key,val] = entries;

			if (maxDepth && maxDepth > 0 && level > maxDepth) return;
			if (blacklist?.includes(key)) {idx++; return};

			let data, type;
			const id = `${ids}${level}-${idx}`; 

			switch (typecheck(val)) {
				case 'map':
				case 'object-literal': data = Object.entries(val); break;

				case 'array': {
					if (val.every(v => typecheck(v, 'primative'))) 
						type = { type: 'select', listOptions: val }
					else data = Object.entries({ ...val })
				}; break;

				case 'string': 	type = val.length > 70 ? 'textarea' : 'text'; break;
				case 'int': 	
				case 'float': 	type = 'number'; break;
				case 'boolean': type = 'checkbox'; break;
				case 'date':	type = 'date'; break;
			};

			if (!type && !data) return;

			type = typeof type === 'object' ? type : { type };
			baseSchema.input[id] = val;
			fields[key]
				? baseSchema.items.push(itemSchema(id, key, fields[key]))
				: baseSchema.items.push(itemSchema(id, key, type));

			data.forEach(([k,v],i) => {
				const K = typeof k === 'number' ? key+'['+k+']' : k;
				flatMap([K,v], i, level +1)
			})
		}; 

		switch (typecheck(items)) {
			case 'map':
			case 'object-literal': flatMap(Object.entries(items)); break;
			case 'array': flatMap(Object.entries({ ...items })); break;
			default: throw new Error("resolveConfig Compile Error. <items> must be of type object-literal, map or array")
		};

		return baseSchema
	}

	function createSemiCustomFromGlobalsAndTypeSpecs() {
		// Create a new form with individual types via each fields input ( <fields:[{<name>: <type:String>}]> )
		fields.forEach((field,idx) => {
			baseSchema.items.push (
				itemSchema(idx, Object.keys(field)[0], {
					id: ids+idx,
					name: names || Object.keys(field)[0],
					type: Object.values(field)[0],
			}) )
		});
		return baseSchema;
	} 

	function createCustomFromConfig() {
		// Create a new form with fully custom input from each fields input ( <fields:{<fieldName>: { ...attributes }} )
		Object.entries(fields).forEach(([k,v],idx) => {
			baseSchema.items.push(itemSchema(idx, k, v))
		});
		return baseSchema;
	} 

	function createSemiCustomFromGlobalArrays() {
		/** Create a new form specifying config via ordered values in globals arrays like: 
		 * ( <names:['first', (v)=>v.idx._toOrdered(), null, 'last']> ) 
		 * ( <type:['text', 'date', 'textarea', 'text']> ) 
		 * ( <labels:[null, null, 'notes', 'Final Thoughts']> ) */
		const customFields = ['types', 'names', 'ids', 'labels', 'placeholders', 'required']
			.filter(f => Array.isArray(config[f]))
			.sort((a,b) => config[b].length - config[a].length);
		config[customFields[0]].forEach((col,idx) => {
			baseSchema.items.push (
				itemSchema(idx, null, Object.fromEntries (
					customFields.map(f =>
						f.at(-1) === 's' 
							? [f.slice(0, f.length -1), config[f]?.[idx]]
							: [f, config[f]?.[idx]]
					))
				)
			)
		})
		return baseSchema
	}

	// Determine the input configuration, and prepare an array to be mapped over by the return
	if (items) {
		if 		(typecheck(items, 'int')) 				return createSpecifiedNumber()
		else if (typecheck(items, ['object','array'])) 	return hydrateFromItemsWithConfigAndDefaults()
		else 	throw badConfigErr;
	} else if (fields) {
		if		(typecheck(fields, 'array')) 			return createSemiCustomFromGlobalsAndTypeSpecs()
		else if	(typecheck(fields, 'object-literal')) 	return createCustomFromConfig()
		else 	throw badConfigErr;
	} else {
		if (!fields && [types, names, ids, labels, placeholders, required].some(f => Array.isArray(f) && f.length > 0)) 
														return createSemiCustomFromGlobalArrays()
	}
};
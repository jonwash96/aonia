let defaultMax = 200;
export default function RecursiveMap({ parent, count, max }) {
	if (count === null || count === undefined) count = 0;
	if (max === null || max === undefined) max = defaultMax;
	if (count === max ) return console.warn("@RecursiveMap. Maximum recursions Reached ("+max+")")

	let data, O = false;
	switch (typeof parent) {
		case 'object': {
			if (parent === null) return <div>[null]</div>
			else if (parent === undefined) return <div>[undefined]</div>
			else if (Array.isArray(parent)) data = parent
			else if (isObjectLiteral(parent)) {data = Object.entries(parent); O = true}
			else return <div>[Unhandled Object Type]</div>
		} break;
		case 'number': 
		case 'boolean':
		case 'string': return (<div>{parent}</div>); break;
	};

	try {
		return (
			<ul>
				{data.map((datum,idx) =>
					<li key={idx}>
						{O && <><strong>{datum[0]}: </strong><br /></>}
						<RecursiveMap parent={O ? datum[1] : datum} count={count +1}/> 
					</li>
				)}
			</ul>
		)
	} catch {
		return (
		<p className="danger error-text text-red">
			<i>RecursiveMap error. Please refresh the page or contact the developer.</i>
		</p>)
	}
}

function isObjectLiteral(obj) {
	return !(obj === null || typeof obj === 'undefined')
		? obj.constructor.name === 'Object'
		: false
};
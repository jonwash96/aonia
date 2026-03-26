/** tc | typecheck
 * ****************************************************************************
 * Author: Jonathan Washington
 * Description: A handy function for simple typechecking in js.
 * Version: 0.1
 * ****************************************************************************
 * @param { val:Any }: Required — The value to be checked.
 * @param { type:String }: Optional — Boolean: the literal type of any object.
 * 		- NOT EQUIVALENT TO `typeof val === '<type>'`. For extended funcion.
 * 		- Includes extended types, i.e. 'int[eger]', 'float[ingpoint]', 
 * 		  'digit', 'letter', '
 * 		- If declared, the function returns a boolean.
 * 		- Case insensitive.
 * @param { callback:Function }: Optional — A callback function to execute
 * 	upon completion of the evaluation. Receives result as first argument.
 * 		- Must be the last argument passed in regardless of param count.
 */



const isObjectLiteral = (arg) =>
	!(arg === null || typeof arg === 'undefined')
		? arg.constructor.name === 'Object'
		: false;


export default function typecheck(val, type, option) {
	const isInt = /^-?\d+$|^-?0+\d*$/.test(val) || val === 0 || val === -0;
	const isFloat = /^-?\d+\.\d+$|^-?0+\d*\.0+\d*$|^-?\.0+\d*$|^-?\.\d+0*$/.test(val);
	
	const casein = (r) => r.test(type);
	const caseis = (w) => w === (type);

	try {
		//* Recursive mode for multiple queries
		if (type && Array.isArray(type)) {
			return type.some(q => typecheck(val, q))
		};
		//* Determine type query vs comparison mode. If query, normalize to lowercase.
		if (type && typeof type === 'string' && !/^(c|compare)$/i.test(option))
			type = type.toLowerCase()
		else if (/^(c|compare)$/i.test(option))
			return val.constructor.name === type.constructor.name
		else if (/^(p|proto|prototype)$/i.test(option)) 
			return Object.prototype.toString.call(val);
		
		//* Type Query Mode with extended types
		if (type && typeof type === 'string') {
			if (caseis('null')) return val === null
			else if (val === null) {
				console.warn('tc got', null, 'checking for:', type); 
				return false
			};

			if (caseis('undefined')) return typeof val === 'undefined'
			else if (typeof val === 'undefined') {
				console.warn('tc got', undefined, 'checking for:', type); 
				return false
			};

			if (casein(/^(float|floating-?point|float-?string|digits)$/i))
				return isFloat;

			if (casein(/^(int|integer|digits)$/i)) 
				return isInt;

			if (casein(/^(str|string|num|number|bool|boolean|sym|symbol|arr|array|func|function|bigint|map|date|RegExp|error)$/i)) 
				return val.constructor.name.toLowerCase().startsWith(type);

			if (caseis('primative')) return /string|number|boolean|bigint|symbol/i.test(typeof val);

			/** Distinguish between object literal & other object types. 
				All objects return truthy; boolean for literal, number 1 for other */
			if (casein(/^(obj|object|object-?literal)$/))
				return isObjectLiteral(val)
					? true
					: typeof val === 'object'
						? 1 : false;
		}
		else if (type && type !== 'string') {throw new Error("tc Error! <type> (2nd arg) must be string, or pass 3rd arg 'c|compare' for a type comparison. Got", typeof type, type)}
		//* Type check Mode
		else {
			let result;
			if (isFloat) result = 'float'
			else if (isInt) result = 'int'
			else if (isObjectLiteral(val)) result = 'object-literal'
			else if (Array.isArray(val)) result = 'array'
			else result = val.constructor.name.toLowerCase();

			if (result !== val.constructor.name.toLowerCase()) 
				extendedResult = val.constructor.name + " " + result;

			return /^(a|array)$/i.test(option) 
				? result.split(' ')
				: /^(e|extended)$/.test(option) 
					? extendedResult
					: result 
		}

	} catch (error) {
		const nullOrUndefined = val === null 
			? 'null'
			: typeof val === 'undefined' 
				? 'undefined'
				: console.error("tc Error. Got:", val, error);
		return !type
			? nullOrUndefined
			: caseis('null') ? val === null 
				: caseis('undefined') ? typeof val === 'undefined' 
					: console.error("tc Error. Got:", val, error)
	}
}
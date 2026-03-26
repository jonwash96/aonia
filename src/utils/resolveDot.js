export default function resolveDot (ctx, text) {
	if (typeof text === 'function') return text;
	try {
		const evalMidst = (str) => eval('ctx' + str.match(/(?<=&\{).+(?=\})/g)[0]);

		if (!text) return;
		
		if (typeof text === 'string') {
			if (text.startsWith('&')) 
				return eval('ctx'+text.replace('&', '.'))

			else if (text.match(/&\{.+\}/g)) {
				const x = evalMidst(text);
				return text.replace(/&\{.+\}/g, x);
		}}
		else if (Array.isArray(text)) {
			let m, b;
			const x = text.slice(1).map(i => 
				typeof i === 'boolean'
					? b = i
					: i.startsWith('&')
						? eval(i.replace('&', 'ctx.'))
						: i.startsWith('.') 
							? m = i
							: i.match(/&\{.+\}/g) 
								? evalMidst(i) 
								: i
			);
			const fx = x.filter(v => typeof v === 'string' && !v.startsWith('.'));
			return m
				? b 
					? eval(text[0](...fx)+m)
					: ()=>eval(text[0](...fx)+m)
				: b
					? text[0](...fx)
					: ()=>text[0](...x);
		}
		else return text

	} catch (err) {
		console.error(err);
		console.warn("ctx:", ctx, "\ntext:", text);
		return 'err'
	}
};
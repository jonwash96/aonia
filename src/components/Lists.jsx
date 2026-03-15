import ImageIcon from './ImageIcon'
import * as Menus from './Menus'



export function ContentList({props}) {
	const { name, items, titles, details, maxLines, icon, user, menu, defaultMessage, onClick } = props;

	const resolveDot = (ctx, text) => {
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



	if (!items || items.length === 0) return <p>{defaultMessage || ''}</p>

	return (
		<section className={name+' ContentList'}>
			<ul>
				{items.map((item, idx) => 
					<li key={idx} className={name+'-li clickable'} onClick={resolveDot(item, onClick)}>
						<ImageIcon 
							src={resolveDot(item, icon.images) || icon.src || ''}
							role={icon.role || ''} 
							size={icon.size || '24px'}
							options={icon.options || "round"} 
						/>

						<div className="text-block">
							<p>{resolveDot(item, titles) || item.name || item.title || ''}</p>
							<span>{resolveDot(item, details) || item.details || item.description || ''}</span>
						</div>

						<div className="right">
							<Menus.Ellipses props={{ menu, item }} />
						</div>
					</li>
				)}
			</ul>
		</section>
	)
}
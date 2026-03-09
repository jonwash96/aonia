import ImageIcon from './ImageIcon'
import * as Menus from './Menus'



export function ContentList({props}) {
	const { name, items, titles, details, maxLines, icon, user, menu, defaultMessage, onClick } = props;

	const resolveDot = (item, ctx, text) => {
		if (!text) return;
		if (text.startsWith('&')) 
			return eval(ctx+text.replaceAll('&', '.'))
		
		else if (typeof text === 'string') {
			if (text.match(/&\{.+\}/g)) {
				let x = text.match(/(?<=&\{).+(?=\})/g)[0];
				x = eval(ctx+x);
				v = text.replace(/&\{.+\}/g. x);
		}};
		if (Array.isArray(text)) {
			if (text[1].match(/&\{.+\}/g)) {
				let x = text[1].match(/(?<=&\{).+(?=\})/g)[0];
				x = eval(ctx+x);
				return () => text[0](v.replace(/&\{.+\}/g, x));
			}
		}
		else return text
	};



	if (!items || items.length === 0) return <p>{defaultMessage || ''}</p>

	return (
		<section className={name+' ContentList'}>
			<ul>
				{items.map((item, idx) =>
					<li key={idx} className={name+'-li'} onClick={()=>onClick('/chat/'+item._id)}>
						<ImageIcon 
							src={resolveDot(item, 'item', icon.images) || icon.src || ''} //? This won't work, but whatif e() just returns a callback that performs the logic in place? Or better yet, use 'this'
							role={icon.role || ''} 
							size={icon.size || '24px'}
							options={icon.options || "round"} 
						/>

						<div className="text-block">
							<p>{resolveDot(item, 'item', titles) || item.name || item.title || ''}</p>
							<span>{resolveDot(item, 'item', details) || item.details || item.description || ''}</span>
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
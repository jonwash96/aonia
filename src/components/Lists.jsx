function resolveDot(ctx, text) {
	if (!text) return;
	if (text.startsWith('&')) 
		return eval(ctx+text.replaceAll('&', '.'))
	else return text
}

function e(ctx, content) {
	if (typeof content !== 'string') return content;
	if (content.startsWith('eval::')) 
		return eval(content.slice(6).replace('&', ctx+'.'))
	else return content
}



export function ContentList({props}) {
	const { name, items, titles, details, maxLines, icon, user, menu } = props;

	return (
		<section className={name+' ContentList'}>
			{items.map((item, idx) =>
				<li key={idx} className={name+'-li'}>
					<ImageIcon 
						src={e(icon.content) || icon.content || icon.images} //? This won't work, but whatif e() just returns a callback that performs the logic in place? Or better yet, use 'this'
						role={icon.role || ''} 
						size={icon.size || '24px'}
						options={icon.options || "round"} 
					/>

					<div className="text-block">
						<p>{resolveDot(item, titles) || item.name || item.title || ''}</p>
						<span>{resolveDot(item, details) || item.details || item.description || ''}</span>
					</div>

					<div className="right">
						<Menus.Ellipses props={ menu } />
					</div>
				</li>
			)}
		</section>
	)
}
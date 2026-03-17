import '../utils/bancroft-proto.js'
import ImageIcon from './ImageIcon';



export function Ellipses({props}) {
	const { name, id, icon, item } = props;
	const data = Object.entries(props).filter(([k]) => k.startsWith('&'));

	return (
		<div id={id || ''} className={(name || '')+' flyout-menu'}>
			<ImageIcon role={icon || "ellipses"} size="1.5em" dstyle={{height: '36px'}} />
			<ul>
				{data.map(([k,v]) => {
					let title = k.slice(1).replaceAll('_',' ')._toTitleCase();

					if (title.includes('%')) {
						title = title.split('%');
						return (
						<li key={k} onClick={v[1]}>
							{v[0] ? title[0] : title[1]}
						</li> )
					}
					return <li key={k} onClick={v}>{title}</li>
				}
				)}
			</ul>
		</div>
	)
}



export function List({props}) {
	const { name, id, item } = props;
	const data = Object.entries(props).filter(([k]) => k.startsWith('&'));

	return (
		<div id={id || ''} className={(name || '')+' list-menu'} >
			<ul>
				{data.map(([k,v]) => {
					let title = k.slice(1).replaceAll('_',' ')._toTitleCase();
					
					if (typeof v === 'string') {
						if (v.startsWith('&')) v = eval('item'+v);
						if (v.match(/&\{.+\}/g)) {
							let x = v.match(/(?<=&\{).+(?=\})/g)[0];
							x = eval('item'+x);
							v = v.replace(/&\{.+\}/g. x);
					}};
					if (Array.isArray(v)) {
						if (v[1].match(/&\{.+\}/g)) {
							let x = v[1].match(/(?<=&\{).+(?=\})/g)[0];
							x = eval('item'+x);
							v = () => v[0](v.replace(/&\{.+\}/g, x));
						}
					}

					if (title.includes('%')) {
						title = title.split('%');

						return (
						<li key={k} onClick={v[1]}>
							{v[0] ? title[0] : title[1]}
						</li> )
					}
					else return <li key={k} onClick={v}>{title}</li>
				}
				)}
			</ul>
		</div>
	)
}
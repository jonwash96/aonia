import '../utils/bancroft-proto'
import ImageIcon from './ImageIcon';

export function Ellipses(props) {
	const { name, id } = props;
	const data = Object.entries(props).filter(([k]) => k.startsWith('&'));

	return (
		<div id={id || ''} className={(name || '')+' flyout-menu'}>
			<ImageIcon role="ellipses" size="1em" />
			<ul>
				{data.map(([k,v]) => {
					const title = k.slice(1).replaceAll('_',' ')._toTotleCase();
					if (title.includes('%')) {
						const title = title.split('%');
						return (
						<li key={k} onClick={v[1]()}>
							{v[0] ? title[0] : title[1]}
						</li> )
					}
					return <li key={k} onClick={v()}>{title}</li>
				}
				)}
			</ul>
		</div>
	)
}
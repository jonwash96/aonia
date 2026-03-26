import ImageIcon from './ImageIcon'
import * as Menus from './Menus'
import resolveDot from '../utils/resolveDot'



export function ContentList({props}) {
	const { name, items, titles, tSize, details, dSize, maxLines, icon, user, menu, defaultMessage, onClick, style } = props;

	const _dSize = dSize ? dSize : '9pt';
	const maxHeight = maxLines && maxLines > 0
		? (_dSize * maxLines + 2.3)+_dSize.match(/[a-z]/g)[0]
		: 'auto';


	if (!items || items.length === 0) return <p>{defaultMessage || ''}</p>

	return (
		<section className={name+' ContentList'}>
			<ul>
				{items.map((item, idx) => 
					<li key={idx} 
						className={name+'-li clickable'} 
						onClick={resolveDot(item, onClick)}
						style={{ ...style?.li, border: resolveDot(item, style?.border) || 'inherit' }}>

						<ImageIcon 
							src={resolveDot(item, icon.images) || icon.src || ''}
							role={icon.role || ''} 
							size={icon.size || '24px'}
							options={icon.options || "round"} 
						/>

						<div className="text-block">
							<p style={{
								fontSize: tSize ? tSize : '',
								maxHeight: '15pt',
								display: 'inline-block', 
								overflow: 'hidden',
							}}>{resolveDot(item, titles)._ellipses(26) || item.name || item.title || ''}
							</p>
							<span style={{ 
								fontSize: _dSize,
								maxHeight: maxHeight,
								display: 'inline-block', 
								overflow: 'hidden',
							}}>{resolveDot(item, details)._ellipses(maxLines ? 42 * maxLines : 0) || item.details || item.description || ''}
							</span>
						</div>

						<div className="right">
							<Menus.Ellipses props={{ ...menu, item }} />
						</div>

					</li>
				)}
			</ul>
		</section>
	)
}
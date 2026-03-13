import ImageIcon from "../../components/ImageIcon"
import { cfk } from '../../utils/gizmo.js'

export function Day({props}) {
	const { name, img, high, low, temp } = props;

  return (
	<div className="WeatherCard">
		<header>{name}</header>
		<ImageIcon role="ph" />
		<div className="high">
			<ImageIcon 
			svg="&uparrow_basic" 
			size="11pt" 
			dstyle={{display: 'inline'}} 
			fill={'var(--lred)'}/>
			{cfk(high, 'k', 'f')}
		</div>
		<div className="low">
			<ImageIcon svg="&uparrow_basic" 
				size="11pt" 
				dstyle={{display: 'inline-block', rotate: '180deg'}} 
				fill={'var(--midblue'}/>
			{cfk(low, 'k', 'f')}
			</div>
		<div className="temp">🌡️ {cfk(temp, 'k', 'f')}</div>
	</div>
  )
}
import ImageIcon from "../../components/ImageIcon"
import { cfk } from '../../utils/gizmo.js'

export function Day({props}) {
	const { name, img, high, low, temp } = props;

  return (
	<div className="WeatherCard">
		<header>{name}</header>
		<ImageIcon role="ph" />
		<div className="high">🔼 {cfk(high, 'k', 'f')}</div>
		<div className="low">🔽 {cfk(low, 'k', 'f')}</div>
		<div className="temp">🌡️ {cfk(temp, 'k', 'f')}</div>
	</div>
  )
}
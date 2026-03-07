import useUser from '../../../contexts/UserContext'
import * as SVG from '../../assets/svg'
import '../../.app-config'
import './ImageIcon.css'



export function ImageIcon(props) {
	const { user } = useUser();
	const noImg = '/svg/noimg.svg';
	let size = props.size || '100%';
	let src = props.src || null;
	let data = props.data || null;
	let content = props.content || null;
	let onClick = props.onClick || null;
	let svg = props.svg ? typeof props.svg === 'string' 
			? ()=>props.svg.startsWith('&') ? SVG[props.svg.slice(1)] : props.svg
			: typeof props.svg === 'function' 
				? props.svg : null
		: null;

	let dstyle = {
		...props.dstyle,
		overflow:'hidden',
	}
	let istyle = {
		...props.istyle,
		height: size,
	}
	let tstyle = {
		...props.tstyle,
		fontSize: size==='100%' ? 'inherit' : size
	}
	if (props.options?.split(' ').includes('round')) dstyle['borderRadius'] = '50%';

	
	switch (props.role) {
		case 'profile-photo': {
			src = user?.photo?.url || defaultProfilePhoto(user);
			istyle = {...istyle, borderRadius:'50%', margin: '0 1%', aspectRatio: '1/1'};
			dstyle = {...dstyle, display:'inline'};
		}; break;

		case 'notifications': {
			svg = () => SVG.notificationIcon(size || '25px');
			if (props.data==0) data = null;
		}; break;

		case 'hamburger': svg = () => SVG.hamburgerMenu || noImg; break;
		case 'messaging': svg = () => SVG.messages || noImg; break;
		case 'ph': src = noImg; break;
		default: src = props.src || noImg;
	}


	return(
		<div 
			className={`img-icn ${props.role}`} 
			data={data} 
			style={dstyle}
			onClick={onClick}
		>
			{src 
				? <img src={src} style={istyle} /> 
				: <div style={tstyle}>{content || ""}
			</div>}
			{svg && svg()}
		</div>
	)
}
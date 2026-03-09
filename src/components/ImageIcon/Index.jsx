import useUser from '../../contexts/userContext.jsx'
import * as SVG from '../../assets/svg.jsx'
import * as config from '../../.app-config.js'
import './ImageIcon.css'



export default function ImageIcon(props) {
	const { user } = useUser();
	const noImg = SVG.noImg;
	let size = props.size || '100%';
	let src = props.src || null;
	let data = props.data || null;
	let content = props.content || null;
	let onClick = props.onClick || null;

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
	if (props.options?.includes('round')) dstyle['borderRadius'] = '50%';

	const defaultColor = (v,d) => config.masterFill || v || d || props.fill || config.defaultFill || 'inherit';


	let svg = props.svg ? typeof props.svg === 'string' 
			? props.svg.startsWith('&') 
				? ()=>SVG[props.svg.slice(1)](size || '1em', defaultColor(), defaultColor()) 
				: props.svg
			: typeof props.svg === 'function' 
				? props.svg : null
		: null;

	
	switch (props.role) {

		case 'profile-photo': {
			src = user?.photo?.url || config.defaultProfilePhoto(user);
			istyle = {...istyle, borderRadius:'50%', margin: '0 1%', aspectRatio: '1/1'};
			dstyle = {...dstyle, display:'inline'};
		}; break;
		
		case 'notifications': {
			svg =()=> SVG.notificationIcon(size || '25px', defaultColor(), defaultColor());
			if (props.data == 0) data = null;
		}; break;
		
		case 'collections': svg =()=> SVG.collectionsIcon	(size || '25px', defaultColor(), defaultColor()) || noImg; break;
		case 'astronomy': 	svg =()=> SVG.telescopeIcon		(size || '25px', defaultColor(), defaultColor()) || noImg; break;
		case 'almanac': 	svg =()=> SVG.libraryIcon		(size || '25px', defaultColor(), defaultColor()) || noImg; break;
		case 'hamburger': 	svg =()=> SVG.hamburgerMenuIcon	(size || '25px', defaultColor(), defaultColor()) || noImg; break;
		case 'messaging': 	svg =()=> SVG.messagesIcon		(size || '25px', defaultColor(), defaultColor()) || noImg; break;
		case 'c-ellipses': 	svg =()=> SVG.circleHBIcon			(size || '25px', defaultColor(), defaultColor()); break;	
		case 'ellipses': 	svg =()=> SVG.ellipses			(size || '25px', defaultColor(), defaultColor()); break;	
		case 'ph': 			svg =()=> noImg(); break;
		
		default: src = (content || svg) ? null : props.src || undefined;
	}


	return (
		<div className={`img-icn ${props.role}`} 
			 data={data} 
			 style={dstyle}
			 onClick={onClick}>
			{src 
				? <img src={src} style={istyle} /> 
				: <div style={tstyle}>{content || ""}</div>
			}
			{svg && svg()}
		</div>
	)
}
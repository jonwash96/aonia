import { styled } from 'styled-components'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { UserContext } from "../../contexts/UserContext";

const NotificationIcon = (height) => <svg height={height} version="1.1" viewBox="144 144 512 512" xmlns="http://www.w3.org/2000/svg">
<path d="m400 179.58c-26.332 0-48.031 21.699-48.031 48.031 0 8.2891 2.3516 15.984 6.1211 22.816-57.785 17.883-99.789 71.754-99.789 135.39v132.25h-31.488c-8.6953 0-15.742 7.0508-15.742 15.742 0 8.6953 7.0508 15.742 15.742 15.742h110.73c-0.58203 3.5469-0.34375 5.4609-0.52344 8.7852 0.003907 34.598 28.383 62.066 62.98 62.066 37.41 0 62.977-28.383 62.977-62.977 0-2.6406-0.19141-5.2695-0.52344-7.8711h110.73c8.6953 0 15.742-7.0508 15.742-15.742 0-8.6953-7.0508-15.742-15.742-15.742h-31.488v-132.26c0-63.637-42.004-117.51-99.785-135.39 3.7656-6.832 6.1211-14.527 6.1211-22.816 0-26.332-21.699-48.031-48.031-48.031zm0 31.488c9.3164 0 16.543 7.2266 16.543 16.543 0 9.3164-7.2266 16.512-16.543 16.512s-16.543-7.1953-16.543-16.512c-0.003906-9.3164 7.2266-16.543 16.543-16.543zm0 64.543c61.328 0 110.21 48.879 110.21 110.21v132.26h-220.42v-132.26c0-61.328 48.879-110.21 110.21-110.21zm-29.367 273.95h58.762c4.793 20.102-7.0977 39.359-29.398 39.359-22.051 0-33.328-18.789-29.367-39.359z"/>
</svg>

export function ImageIcn(props) {
	const { user } = useContext(UserContext);
	let size = props.size || '100%';
	let src = props.src || null;
	let data = props.data || null;
	let content = props.content || null;
	let svg = props.svg || null;

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
			src = user?.photo?.url || '/default-profile-photo.jpg';
			istyle = {...istyle, borderRadius:'50%', margin: '0 1%', aspectRatio: '1/1'};
			dstyle = {...dstyle, display:'inline'};
		}; break;

		case 'notifications': {
			svg = () => NotificationIcon(size || '25px');
			if (props.data==0) data = null;
		}; break;

		case 'ph': src = '/svg/noimg.svg'; break;

		default: src = props.src;
	}

	return(
		<div className={`img-icn ${props.role}`} data={data} style={dstyle}>
			{src ? <img src={src} style={istyle} /> : <div style={tstyle}>{content || ""}</div>}
			{svg && svg()}
		</div>
	)
}

export function errToast(err) {
    console.error(err);
    toast(err.message);
};

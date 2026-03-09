import { useState } from 'react'
import RecursiveMap from '../RecursiveMap'
import { Link, useNavigate } from 'react-router'
import useChat from '../../contexts/chatContext'
import ImageIcon from '../ImageIcon'
import * as Menus from '../Menus'
import * as SVG from '../../assets/svg'
import './Sidebar.css'



export default function Sidebar() {
	const toggleExpanded = () => null;
	const navigate = useNavigate();



  return (
	<nav id="Sidebar">
		<section className="pages">
		<p className="logotype">AONIA</p>
			<NavMenuItem props={{
				name: 'hamburger',
				icon: {
					role: 'hamburger',
					onClick: toggleExpanded
				},
				menu: {
					'&home': ()=>navigate('/'),
					'&profile': ()=>navigate('/profile'),
					'&settings': ()=>navigate('/settings'),
				}
			}}/>
			<NavMenuItem props={{
				name: 'astronomy',
				icon: {
					svg: '&astronomyIcon',
					onClick: ()=>navigate('/')
				},
				menu: {
					'&astronomy': ()=>navigate('/astronomy'),
					'&my_gear': ()=>navigate('/my-gear'),
					'&almanac': ()=>navigate('/almanac')
				}
			}}/>
			<NavMenuItem props={{
				name: 'weather',
				icon: {
					svg: '&weatherIcon',
					onClick: ()=>navigate('/weather')
				},
				menu: {
					'&weather': ()=>navigate('/weather')
				}
			}}/>
			<NavMenuItem props={{
				name: 'chat',
				icon: {
					role: 'messaging',
					onClick: ()=>navigate('/')
				},
				menu: {
					'&chat': ()=>navigate('/chat'),
					'&new_chat': ()=>navigate('/chat/new-chat'),
					'&friends': ()=>navigate('/friends'),
					// '&disconnect%connect': [socket, toggleSocket],
				}
			}}/>
			<NavMenuItem props={{
				name: 'collections',
				icon: {
					svg: '&collectionsIcon',
					onClick: ()=>navigate('/')
				},
				menu: {
					'&collections': ()=>navigate('/collections'),
					'&astrographs': ()=>navigate('/my-photos'),
					'&my_gear': ()=>navigate('/my-gear'),
					'&new_collection': ()=>navigate('/collections/new')
				} 
			}}/>
		</section>
		<section className="more">
			<NavMenuItem props={{
				name: 'people',
				icon: {
					role: 'profile-photo',
					onClick: ()=>navigate('/people')
				},
				menu: {
					'&profile': ()=>navigate('/profile'),
					'&friends': ()=>navigate('/friends'),
					'&Astramuse': ()=>navigate('/astramuse')
				} 
			}}/>
		</section>
	</nav>
  )
}


function NavMenuItem({props}) {
	const { name='', id='', icon={}, menu={} } = props;


	return (
		<div id={id} className={name+' nav-menu-item-wrapper'}>
			<ImageIcon 
				role={icon.role || name}
				svg={icon.svg}
				fill="var(--slgold)"
				onClick={icon.onClick}
				size="45px"
				options='round'
				// dstyle={{ background: 'linear-gradient(to top left, var(--sdblue), var(--steelblue))'}}
			/>
			<div className="expandable">
				<Menus.List props={{ name, ...menu }} />
			</div>
		</div>
	)
}
import React from 'react'
import RecursiveMap from '../RecursiveMap'
import { Link, useNavigate } from 'react-router'
import useChat from '../../contexts/chatContext'
import ImageIcon from '../../components/ImageIcon'
import * as Menus from '../../components/Menus'

export default function Sidebar() {

	const toggleExpanded = () => null;
	const navigate = useNavigate();

  return (
	<nav>
		<section id="pages">
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
					onClick: ()=>navigate('/astronomy')
				},
				menu: {
					'&astronomy': ()=>navigate('/astronomy'),
					'&my_gear': ()=>navigate('/my-gear'),
					'&almanac': ()=>navigate('/almanac')
				}
			}}/>
			<NavMenuItem props={{
				name: 'chat',
				icon: {
					role: 'messaging',
					onClick: ()=>navigate('/chat')
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
					onClick: ()=>navigate('/collections')
				},
				menu: {
					'&collections': ()=>navigate('/collections'),
					'&astrographs': ()=>navigate('/my-photos'),
					'&my_gear': ()=>navigate('/my-gear'),
					'&new_collection': ()=>navigate('/collections/new')
				} 
			}}/>
		</section>
		<div className="more">
			<p className="logotype">AONIA</p>
		</div>
	</nav>
  )
}


function NavMenuItem({ children, name='', id='', icon={}, menu={} }) {
	return (
		<div id={id} className={name+' nav-menu-item-wrapper'}>
			<ImageIcon props={{ ...icon, size:'40px', options: 'round' }} />
			{/* <div className="expandable">
				<ul>
					<Menus.List props={{ name, ...menu }} />
					{ ...children }
				</ul>
			</div> */}
		</div>
	)
}
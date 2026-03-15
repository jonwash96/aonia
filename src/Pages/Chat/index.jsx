import { useState, useEffect } from 'react'
import './index.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import { Link, useNavigate, useParams } from 'react-router'
import Conversation from './Conversation'
import ChatsList from './ChatsList'



export default function Chat() {
	const { uid, user, destroyCredentials, storeUID } = useUser();

	const {	chatSelect } = useChat();
			
	useEffect(() => console.log("@Chat > chatSelect changed:", chatSelect), [chatSelect])

	return (
		<main id="Chat">
			<ChatsList />
			<Conversation />
		</main>
	)
}
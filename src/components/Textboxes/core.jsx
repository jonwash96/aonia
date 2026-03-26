import { useState, useCallback } from 'react'
import './index.css'
import useChat from '../../contexts/chatContext'
import useUser from '../../contexts/userContext'
import * as userService from '../../services/userService'



export default function useSmartTextboxCore(props) {
	const { onSubmit, onChange, onKeyDown, defaultState, value, setValue } = props;

	const { uid, user,	setUser,		storeUser,
			authToken, 	setAuthToken,	destroyCredentials,
			JITAuth,	findFriends,	getNotifications, } = useUser();
	
	const { socket, 	toggleSocket,	appendMessage,
			chats, 		setChats,		chatSelect, 	selectChat,
			status, 	setStatus,		createChat,		findChat,
			deleteChat, renameChat } = useChat();


	const [_input, _setInput] = useState(defaultState);
	const [cmdHistory, setCmdHistory] = useState([]);

	const input = value || _input;
	const setInput = setValue || _setInput;

	const clear =()=> setInput(defaultState);
	const fuzzySpaces = (term) => term.replaceAll(' ', '.+');

	const handleChange = useCallback((e) => {
		if (onChange) return onChange(e);

		const et = e.target;
		const color = et.value.startsWith('/') ? '#0bf' : 'inherit';

		setInput(prev => ({ ...prev, [et.name]: et.value, color}));
	}, [onChange]);

	const handleKeys = useCallback((e) => {
		if (onKeyDown) return onKeyDown(e);

		if (input.text.startsWith('/') || input.text === '') {
			if (e.key === 'ArrowUp') {
				e.preventDefault();
				if ('prevNode' in input) setInput(cmdHistory.at(input.prevNode))
				else if (cmdHistory.length > 0) setInput(cmdHistory.at(-1));
			};
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				if ('nextNode' in input) {
					if (cmdHistory.length > input.nextNode)
						setInput(cmdHistory.at(input.nextNode))
					else if (cmdHistory.length === input.nextNode) clear()
				}
			};
		}
	}, [input, cmdHistory, onKeyDown, defaultState]);

	const handleCMD = useCallback(() => {
		let text = input.text.slice(1);
		let clr; if (text.at(-1) === '$') {clr = true; text = text.replace(/\$$/g, '')};

		if 		(text.startsWith('/')) 	return onSubmit({ ...input, text })
		else if (text.startsWith('eval')) eval(text.slice(5))
		else if (text.startsWith('log')) console.log(eval(text.slice(4)))
		else if (text.startsWith('notif')) getNotifications()
		else if (text.startsWith('addf')) userService.sendFriendRequest (
			{
				user_id: uid,
				profile_id: user.profile._id,
				requested_id: text.split(' ')[2],
				requested_username: text.split(' ')[2],
				username: user.username,
				displayname: user.displayname,
				method: text.split(' ')[1]
			}	
		)
		else if (text.startsWith('resf')) userService.respondFriendRequest (
			{
				user_id: uid,
				profile_id: user.profile._id,
				requestor_id: text.split(' ')[1],
				username: user.username,
				displayname: user.displayname,
				response: {
					recipientActivityID: text.split(' ')[2],
					senderActivityID: text.split(' ')[3],
					choice: text.split(' ')[4] || "accepted"
				}
		}	)
		else if (text.startsWith('fres')) {
			const notif = user.notifications.at(-1).activityID;
			if (!notif.category === 'friend-request') return console.warn("@Friend Request Response notification not set")
			userService.respondFriendRequest (
			{
				user_id: uid,
				profile_id: user.profile._id,
				requestor_id: notif.data.senderProfileID,
				username: user.username,
				displayname: user.displayname,
				response: {
					recipientActivityID: notif._id,
					senderActivityID: notif.data.senderActivityID,
					choice: text.split(' ')[1] || "accepted"
			}	}
		)}
		else onSubmit({ ...input, text });

		return clr ? clear() : undefined
	}, [onSubmit]);

	const validateSubmit = useCallback((e) => {
		e.preventDefault();
		if (input.text === '') return console.warn("No input");

		if (input.text.startsWith('/')) {
			setCmdHistory(prev => [ ...prev, { 
				...input, 
				prevNode: cmdHistory.length === 0 ? 0 : cmdHistory.length -1, 
				nextNode: cmdHistory.length +1 } ]);

			return handleCMD();
		}

		onSubmit(input);
		setInput(defaultState);
	}, [input, onSubmit, handleCMD, defaultState]);


	return { input, setInput, handleChange, handleKeys, validateSubmit, fuzzySpaces, clear };
}
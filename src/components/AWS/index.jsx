import { useState, useEffect } from 'react'
// import './index.css'
import useUser from '../../contexts/userContext'
import { S3Client, CreateBucketCommand, DeleteBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

export default function AWS() {
	const { uid, user, destroyUID, storeUID } = useUser();
	const defaultState = { text: '', files: [] };
	const [input, setInput] = useState(defaultState);

	// console.log("@Chat. socket:", socket)

	const handleChange = (et) => setInput({ ...input, [et.name]: et.value });
	const clear = () => setInput(defaultState);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (input.text==='clear') {destroyUID(); return clear()};

		console.log(input);
		const newMessage = { ...input, uid: uid };
		setConversation(prev => [ ...prev, newMessage ]);
		clear();
	}

	const client = new S3Client({
		region: "us-east-2",
		credentials: fromCognitoIdentityPool({
		  // Replace the value of 'identityPoolId' with the ID of an Amazon Cognito identity pool in your Amazon Cognito Region.
		  identityPoolId: "us-east-2:edbe2c04-7f5d-469b-85e5-98096bd75492",
		  // Replace the value of 'region' with your Amazon Cognito Region.
		  clientConfig: { region: "us-east-2" },
		}),
	  });

	return (
		<main id="chat">
			<header>
				<h1>Chat</h1>
			</header>

			<section id="conversation">
					<ThreadedConversation conversation={conversation} uid={uid} />
			</section>

			<section id="write">
				<form onSubmit={handleSubmit}>
					<div className="upload">
						<input type="file" name="files" onChange={e => handleChange(e.target)} />
					</div>
					<div className="input">
						<input type="text" name="text" 
						onChange={e => handleChange(e.target)} value={input.text}
						autoComplete="off"
						/>
						<button type="button" onClick={clear}>❌</button>
						<button type="submit">➣</button>
					</div>
				</form>
			</section>
		</main>
	)
}

function ThreadedConversation({ conversation, uid }) {
	// console.log("@conversation", conversation)
	return (
		<>
		{conversation.map((message,idx) => 
			<div key={idx} className={"bubble "+(message.uid===uid ? 'user' : 'friend')} name={message.user}>
				{message.text}<br/>
				<small>
					User: {message.uid}<br/>
					UID: {uid}<br/>
					Session: {message.session}
				</small>
			</div>
		)}
		</>
	)
}
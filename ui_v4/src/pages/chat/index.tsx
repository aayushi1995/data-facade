import React,{ useContext, useRef, useState } from 'react'
import {  Space, Spin } from 'antd';
import ChatFooter from './ChatFooter';
import ChatBlock from './ChatBlock/index'
import { IChatMessage } from './ChatBlock/ChatBlock.type';
import AppContext from "@/contexts/AppContext"
import { StyledPrivacyPolicyFooter } from './Chat.styles';
import ChatActionsBlock from './ChatActionsBlock';
import { actionListFromBE, getMessageType } from './constants'

let getDefaultQuestion = (username:string) => {
	return [{
		id: new Date().toTimeString(),
		message: `Hello! How can I help you ${username}?`,
		time: new Date().getTime(),
		from: "system",
		username: 'Data User'
	}]
}

const ChatComponent = () => {
	const appContext: any = useContext(AppContext)
	let defaultQuestion = getDefaultQuestion(appContext.userName) as IChatMessage[]

	let [chatApp, setChatApp] = useState<IChatMessage[] | undefined>(defaultQuestion)
	let [loading, setLoading] = useState(false)
	let [showActions, setShowActions]= useState(false)
	let [actions, setActions] = useState<any[]>([])

	const chatFooterRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const scrollToBottom = () => {
		chatFooterRef?.current?.scrollIntoView({ behavior: "smooth" })
  	}


	const handleTextMessage = (message:any, username: 'user' | 'system', type?: 'text' | 'actions' | 'visualization' ) => {
		// temporary function for dummy data user

			let temp:IChatMessage = {
				id: new Date().toTimeString(),
				message: message,
				time: new Date().getTime(),
				from: username,
				username: username === 'system' ? 'Data User' : appContext?.userName,
				type: type || 'text'
			}
			// add it to the array
			setChatApp(chats => chats ? [...chats, temp] : [temp])
			
			if(username === 'user') {
				setShowActions(false)
				handleSystemResponse(message)
				setLoading(true)
			}
			
		}
	

	// Temporary dummy function to mock Data User
	const handleSystemResponse = (message:string) => {

		// dummy business logic
		let type = getMessageType(message)

		setTimeout(() => {
			
			setLoading(false)
			switch (type) {
				case 'text' : {
					return handleTextMessage('Do you want some insights on analytics ?', 'system')
				}
				case 'actions' : {
					return handleActions(actionListFromBE)
				}
			} 
			scrollToBottom()
			
		},2000)
	}

	const handleActions = (actions:any) => {
		setShowActions(true)
		setActions(actions)
	}

	const handleChartsMessage = (actions:any) => {

	}


	return (
		<div>
			<Space direction="vertical" size="large" style={{ display: 'flex', minHeight: '55vh', padding: '5%'}}>
				{/* chat component */}
				<>
				{chatApp?.map(({id, type, ...props}:IChatMessage) => {
					return <ChatBlock id={id} key={id+'Chat'} {...props} />
				})}
				</>
				{/* Loader till the Data User proccess */}
				{loading && <Spin />}
				{showActions && <ChatActionsBlock actions={actions}/>}

			</Space>

			{/* Privacy policy footer */}
			<StyledPrivacyPolicyFooter >
				This platform is protected through security encryption. Your sensitive data will not be shared.
				<span style={{color:'blue', marginLeft: '10px'}}>Our privacy policy</span>
			</StyledPrivacyPolicyFooter>

			{/* dummy div to scroll when new message appears */}
			<div style={{padding:'10px'}} ref={chatFooterRef}></div>

			{/* sticky chat footer component */}
			<ChatFooter scrollToBottom={scrollToBottom} handleSend={handleTextMessage}/>
		</div>

	)
}

export default ChatComponent


/* TODO 
// 1. Scroll to the bottom of the page when chats go in scrollable
2. handle action promts from the system
3. Handle how to show Dummy Charts
// 4. ChatBlock should have some kind of text wrap when typing huge Paragraph and stuff like that.
// 5. handle username
// 6. privacy policy should be added.
7. Store data in context
8. add animation while tyi
*/
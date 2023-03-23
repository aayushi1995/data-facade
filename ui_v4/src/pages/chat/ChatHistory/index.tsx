import React, { useContext, useEffect, useRef, useState } from 'react'
import dataManager from '@/api/dataManager'
import { Chat } from '@/generated/entities/Entities'
import Card from 'antd/es/card'
import {ReactComponent as SearchSvg} from '@assets/icons/search.svg'
import {ReactComponent as ChatBubble} from '@assets/icons/chat_bubble.svg'
import {ReactComponent as EditIcon} from '@assets/icons/edit-icon.svg'
import { RouteContext } from '@components/BrowserTab/index'
import { StyledCustomInput,SearchInputWrapper,  ChatHistoryItems, StickyHeader, StyledChatName } from './ChatHistory.styles'
import Typography from 'antd/es/typography'
import { FlexBox } from '../ChatFooter/ChatFooter.styles'
import { Button, Input, Space } from 'antd'
import { CheckOutlined } from '@ant-design/icons'


const ChatHistory = () => {
    const {handleNewTabWithId} = useContext(RouteContext)

    const [chatHistory, setChatHistory] = useState<Chat[] | []>([])
    const [searchKey, setSearchKey] = useState<string>('')

    useEffect(() => {
        dataManager.getInstance.retreiveData("Chat",{}).then((response:any) => {
           if(response.length > 0) {
                setChatHistory(response)
           }
        }).catch((error:any) => {
            console.log(error)
        })
    },[])

    const handleSearchChange= (event:any) => {
        setSearchKey(event.target.value)
    }

    const handleChatClick= (id:any, name?:string) => {
        handleNewTabWithId(id,`${name?.substring(0,10)}...`)
    }


    return (
        <Card style={{height: '80vh', overflow:'scroll'}}>
            <StickyHeader>
                <Typography.Title level={4}>History</Typography.Title>
                <SearchInputWrapper>
                    <SearchSvg/>
                    <StyledCustomInput placeholder="Search in chat history" allowClear onChange={handleSearchChange} />
                </SearchInputWrapper>
            </StickyHeader>

            <div style={{marginTop:'20px'}}>
                {searchKey === "" ?  chatHistory?.map((obj:Chat) => {
                    return <ChatItem {...obj} handleChatClick={handleChatClick} handleSaveChatName/>
                }) : chatHistory?.filter((obj:Chat) => obj?.Name?.toLowerCase()?.includes(searchKey.toLowerCase())).map((obj:Chat) => {
                    return <ChatItem {...obj} handleChatClick={handleChatClick} handleSaveChatName/>
                })}
            </div>
        </Card>
    )
}
export default ChatHistory

const ChatItem = ({handleChatClick, handleSaveChatName, ...props}:any) => {
    const [showEditable, setEditable]= useState(false)
    const [name, setName] = useState(props?.Name || '')
    
    const handleShowEditable = () => {
        setEditable(!showEditable)
    }

    const handleNameChange = (event?:any) => {
        setName(event?.target?.value)
    }

    const handleSaveName = () => {
        // call the api to save the name and everything
        setEditable(false)
        handleSaveChatName(props?.id, name)
    }

        return (
            <ChatHistoryItems>
            <FlexBox style={{alignItems: 'center'}}>
                <ChatBubble/>
                {!showEditable 
                ? <StyledChatName level={5} >
                    {props?.Name || props?.Id}
                </StyledChatName> 
                : <FlexBox style={{margin:'0px 30px'}}><Input onChange={handleNameChange} type="text" /><Button type="ghost" icon={<CheckOutlined />}  onClick={handleSaveName}/></FlexBox>}
            </FlexBox>
            <div>
                <Button type="ghost" icon={<EditIcon />} onClick={() => handleChatClick(props?.Id, props?.Name || props?.Id)}></Button>
            </div>
        </ChatHistoryItems>
        )
}
import React, { useContext, useEffect, useState } from 'react'
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
import { Button, Space } from 'antd'


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

    const handleChatClick= (id:any) => {
        handleNewTabWithId(id)
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
                    return <ChatItem {...obj} handleChatClick={handleChatClick}/>
                }) : chatHistory?.filter((obj:Chat) => obj?.Id?.toLowerCase()?.includes(searchKey.toLowerCase())).map((obj:Chat) => {
                    return <ChatItem {...obj} handleChatClick={handleChatClick}/>
                })}
            </div>
        </Card>
    )
}
export default ChatHistory

const ChatItem = ({handleChatClick, ...props}:any) => {
        return (
            <ChatHistoryItems>
            <FlexBox style={{alignItems: 'center'}}>
                <ChatBubble/>
                <StyledChatName level={5} >
                    {props?.Name || props?.Id}
                </StyledChatName>
            </FlexBox>
            <div>
                <Button type="ghost" icon={<EditIcon />} onClick={() => handleChatClick(props?.Id)}></Button>
            </div>
        </ChatHistoryItems>
        )
}
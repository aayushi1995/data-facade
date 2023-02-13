import { setLocalStorage } from "@/utils";
import { PlusOutlined } from "@ant-design/icons"
import { Button, Col, Row } from "antd"
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
	const navigate = useNavigate();
	const initiateChat = () => {
		const chatID = uuidv4();
		setLocalStorage('chat_id', chatID);
		navigate(`/chats/${chatID}`)
	
	}
	return (
		<Row>
			<Col sm={6}>
				<Button block size="large" type="default" onClick={() => initiateChat()} icon={<PlusOutlined />}>Initiate Chat</Button>
			</Col>
		</Row>
	)
}

export default Chat
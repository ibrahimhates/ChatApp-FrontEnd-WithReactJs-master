import { Button } from 'react-bootstrap';
import MessageContainer from './MessageContainer';
import SendMessage from './SendMessage';
import ConnectedUsers from './ConnectedUsers';

const Chat = ({ messages, sendMessage, closeConnection, users,userInfo,sendAudioToBackend }) => {

	return (
		<div>
			<Button variant="danger" onClick={() => closeConnection()}>
				Leave Room
			</Button>
			<ConnectedUsers users={users} connectedRoom={userInfo.roomName} />
			<div className="chat">
				<MessageContainer messages={messages} />
				<SendMessage sendMessage={sendMessage} sendAudioToBackend={sendAudioToBackend} />
			</div>
		</div>
	);
};

export default Chat;

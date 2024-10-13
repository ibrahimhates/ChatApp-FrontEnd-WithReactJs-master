import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Lobby from './companents/Lobby';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import Chat from './companents/Chat';
import {Base64} from 'js-base64';

const App = () => {
	const [connection, setConnection] = useState();
	const [messages, setMessages] = useState([]);
	const [rooms,setRooms] = useState([]);
	const [users, setUsers] = useState([]);
	const [isUserConnect,setIsUserConnect] = useState(false);
	const [connectUser,setConnectUser] = useState();

	const sendAudioToBackend = async (audioData) => {
		try {
            await connection.invoke("SendAudioToRoom", audioData);
		} catch (error) {
		  console.error('Audio gönderim hatası:', error);
		}
	  };

	const connect = async () => {
		try {
			const connection = new HubConnectionBuilder()
				.withUrl('https://192.168.1.139:7157/chat')
				.configureLogging(LogLevel.Information)
				.build();

			connection.on('ReceiveMessage', (user, message) => {
				setMessages((messages) => [...messages, { user, message }]);
			});

			connection.onclose((e) => {
				setConnection();
				setMessages([]);
			});

			connection.on('UsersInRoom', (users) => {
				setUsers(users);
			});

			connection.on('AllRooms', (allRooms) => {
				setRooms(allRooms);
			});

			connection.on('UserInfo', (userInfo) => {
				setConnectUser(userInfo);
			});

			connection.on("ReceiveAudio", (audioData) => {
				const contentType = 'audio/webm;codecs=opus';
				const byteCharacters = atob(audioData);
				const byteArrays = [];

				for (let offset = 0; offset < byteCharacters.length; offset += 512) {
					const slice = byteCharacters.slice(offset, offset + 512);

					const byteNumbers = new Array(slice.length);
					for (let i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
					}

					const byteArray = new Uint8Array(byteNumbers);
					byteArrays.push(byteArray);
				}

				const blob =  new Blob(byteArrays, { type: contentType });

				const audioUrl = URL.createObjectURL(blob);
				const audio = new Audio(audioUrl);
				audio.play()
					.then(() => {
					console.log('Audio playing');
					})
					.catch((error) => {
					console.error('Error playing audio:', error);
					});
			});

			await connection.start();
			setConnection(connection);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		connect();
	},[]);

	const joinRoom = async (user, room, isNewRoom) => {
		try {
			const roomData = isNewRoom
				? { user, roomName: room,roomId:null }
				: { user, roomId: room,roomName:null };

			await connection.invoke("JoinRoom", roomData);
		} catch (e) {
			console.log(e);
		}
		setIsUserConnect(true);
	};

	const sendMessage = async (message) => {
		try {
			await connection.invoke("SendMessage", message);
		} catch (e) {
			console.log(e);
		}
	};

	const closeConnection = async () => {
		try {
			await connection.stop();
			window.location.reload();
			setIsUserConnect(false);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div>
			<div className="d-grid justify-content-center">
				<h2>Chat App</h2>
				<hr className="line" />
			</div>
			
			{!isUserConnect ? (
				<div className="row d-grid justify-content-center align-items-center">
					<Lobby joinRoom={joinRoom} rooms={rooms} />
				</div>
			) : (
				<Chat
					userInfo={connectUser}
					messages={messages}
					sendMessage={sendMessage}
					closeConnection={closeConnection}
					users={users}
					sendAudioToBackend={sendAudioToBackend}
				/>
			)}
		</div>
	);
};

export default App;

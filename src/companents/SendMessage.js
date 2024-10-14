import { Form, Button, FormControl, InputGroup } from 'react-bootstrap';
import { useState,useRef } from 'react';
import { FaMicrophone, FaHeadphones } from "react-icons/fa"; 
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';

const SendMessage = ({ sendMessage, sendAudioToBackend}) => {
	const [message, setMessage] = useState('');
	const [isMicrophoneOn, setIsMicrophoneOn] = useState(false); 
	const [isHeadphonesOn, setIsHeadphonesOn] = useState(true); 
	const recorderRef = useRef(null);
	
	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({audio:true});

			recorderRef.current = RecordRTC(stream, {
				type: "audio",
				mimeType: "audio/webm",
				recorderType: StereoAudioRecorder,
				timeSlice: 20,
				desiredSampRate: 64000,
				numberOfAudioChannels: 1,
				bufferSize: 4096,
				ondataavailable: (blob) => {
				  console.log("Blob okunuyor: ", blob);
			  
				  const reader = new FileReader();
				  reader.onload = () => {
					const base64data = reader.result;
					console.log("Base64data: ", base64data);
					sendAudioToBackend(base64data.split("base64,")[1]);
				  };
			  
				  reader.readAsDataURL(blob);
				},
			  });
			  
			  recorderRef.current.startRecording();
			  
		} catch (error) {
		  console.error('Error accessing media devices:', error);
		}
	};

	const stopRecording = () => {
		recorderRef.current.stopRecording();
	};

	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault();
				sendMessage(message);
				setMessage('');
			}}>
			<InputGroup>
				<FormControl
					placeholder='message...'
					onChange={(e) => setMessage(e.target.value)}
					value={message}
				/>
				<div className="d-flex justify-content-center align-items-center p-1 bg-white">
					<div
						className="icon"
						onClick={() => {
							setIsMicrophoneOn(!isMicrophoneOn)
							if(!isMicrophoneOn){
								startRecording();
							}else{
								stopRecording();
							}
						}}
					>
						{isMicrophoneOn ? (
							<FaMicrophone size={30} color="green" /> // Mikrofon açık
						) : (
							<FaMicrophone size={30} color="red" /> // Mikrofon kapalı
						)}
					</div>

					<div
						className="icon"
						onClick={() => setIsHeadphonesOn(!isHeadphonesOn)}
					>
						{isHeadphonesOn ? (
							<FaHeadphones size={30} color="green" /> // Kulaklık açık
						) : (
							<FaHeadphones size={30} color="red" /> // Kulaklık kapalı
						)}
					</div>
				</div>
				<div className='input-append'>
					<Button disabled={!message} type='submit'>
						Send
					</Button>
				</div>
			</InputGroup>
		</Form>
	);
};

export default SendMessage;

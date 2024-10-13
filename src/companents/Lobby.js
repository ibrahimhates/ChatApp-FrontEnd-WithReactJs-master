import { useEffect, useState } from 'react';
import { Form, Button,ListGroup } from 'react-bootstrap';

const Lobby = ({ joinRoom,rooms }) => {
	const [user, setUser] = useState();
	const [selectedRoom, setSelectedRoom] = useState("");
	const [addNewRoom, setAddNewRoom] = useState("");

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<div style={{ marginBottom: "20px", width: "350px" }}>
				<h4 style={{ textAlign: "center" }}>Tum odalar</h4>
				<ListGroup>
					{rooms.map((room) => (
						<ListGroup.Item
							key={room.key}
							active={selectedRoom === room.key}
							onClick={() => {
								if (selectedRoom === room.key)
									setSelectedRoom("");
								else setSelectedRoom(room.key);
							}}
							style={{ cursor: "pointer" }}
						>
							{room.value}
						</ListGroup.Item>
					))}
				</ListGroup>
			</div>

			<div style={{ width: "100%" }}>
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						if (selectedRoom) {
							joinRoom(user, selectedRoom, false);
						} else if (addNewRoom) {
							joinRoom(user, addNewRoom, true);
						}
					}}
				>
					<Form.Group>
						{!selectedRoom && (
							<Form.Control
								placeholder="Yeni oda ismi..."
								value={addNewRoom}
								onChange={(e) => {
									setAddNewRoom(e.target.value);
								}}
							/>
						)}
						<Form.Control
							placeholder="Adınızı Girin..."
							onChange={(e) => setUser(e.target.value)}
							style={{ marginTop: "10px" }}
						/>
						<Button
							variant="success"
							type="submit"
							disabled={!user || (!selectedRoom && !addNewRoom)}
							style={{ marginTop: "10px" }}
						>
							Katıl
						</Button>
					</Form.Group>
				</Form>
			</div>
		</div>
	);
};

export default Lobby;

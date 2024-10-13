import { ListGroup, Card } from 'react-bootstrap';

const ConnectedUsers = ({ users,connectedRoom }) => {
	return (
		<Card
			className="user-list mb-3 shadow-sm"
			style={{ maxWidth: "500px" }}
		>
			<Card.Header className="bg-primary text-white text-center">
				<h4>{`Oda: `+connectedRoom}</h4>
			</Card.Header>
			<ListGroup variant="flush">
				{users.map((u, index) => (
					<ListGroup.Item key={index} className="text-success">
						{u}
					</ListGroup.Item>
				))}
			</ListGroup>
		</Card>
	);
};

export default ConnectedUsers;

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { AppContext } from "../pages/Managment";
import { useContext} from "react";

const ReminderFollowUp = () => {
  const { isManagment} = useContext(AppContext);
  console.log(" Esto es isManagment:", isManagment);

  return (
    <Card>
      <Card.Header>Seguimiento</Card.Header>
      <Card.Body>
        <Card.Title>Bruno Diaz</Card.Title>
        <Card.Text>9:26 A. M.</Card.Text>
        <Card.Text>Seguimiento</Card.Text>
        <Card.Text>$31,480</Card.Text>
        <Card.Text>370700000000004</Card.Text>
        <Button variant="primary">Realizar</Button>
      </Card.Body>
    </Card>
  );
};
export default ReminderFollowUp;

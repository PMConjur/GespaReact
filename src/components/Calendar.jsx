import "cally";

import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";

const Calendar = () => {
  return (
    <Card>
      <Card.Body>
        <calendar-range>
          <calendar-month></calendar-month>
        </calendar-range>
      </Card.Body>
    </Card>
  );
};

export default Calendar;

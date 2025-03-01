import React, { useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null); // Estado para el día seleccionado

  // Obtener días del mes actual
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generar los días del mes en formato de tabla
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<td key={`empty-${i}`} className="empty"></td>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <td
        key={day}
        className={`calendar-day ${
          selectedDay === day ? "bg-info text-white" : ""
        }`} // Aplicar estilo si está seleccionado
        onClick={() => setSelectedDay(day)} // Manejador de clic para seleccionar el día+
        style={{ cursor: "pointer"}} 
      >
        {day}
      </td>
    );
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(<tr key={i}>{days.slice(i, i + 7)}</tr>);
  }

  return (
    <Container className="mt-4 text-center">
      <Row className="d-flex justify-content-between align-items-center mb-1">
        <Col xs="auto">
          <Button variant="secondary" onClick={prevMonth}
          style={{padding: "0.1rem 1rem"}}>
            <span>{'<'}</span>
          </Button>
        </Col>
        <Col xs="auto">
          <h4 className="text-white">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h4>
        </Col>
        <Col xs="auto">
          <Button variant="secondary" onClick={nextMonth}
          style={{padding: "0.1rem 1rem"}}>
          <span>{'>'}</span>
          </Button>
        </Col>
      </Row>
      <div className="table-responsive">
        <Table bordered variant="dark" className="text-center">
          <thead>
            <tr>
              <th>Dom</th>
              <th>Lun</th>
              <th>Mar</th>
              <th>Mié</th>
              <th>Jue</th>
              <th>Vie</th>
              <th>Sáb</th>
            </tr>
          </thead>
          <tbody>{weeks}</tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Calendar;
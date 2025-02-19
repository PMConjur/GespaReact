import { Card, Table, Button, InputGroup, FormControl } from "react-bootstrap";
import { Whatsapp, ChatDots } from "react-bootstrap-icons";


const Telephones = () => {
  return (
    <Card className="overflow-auto bg-dark">
      <Card.Body>
        <h5 className="card-title text-white">Telefonos</h5>
        <Table hover variant="dark" className="table" responsive="sm">
          <thead>
            <tr>
              <th colSpan="3">
                <div className="d-flex">
                  <Button
                    variant="success"
                    className="me-2"
                    style={{ width: "20%" }}
                  >
                    <Whatsapp /> WhatsApp
                  </Button>
                  <Button
                    variant="light"
                    className="me-2"
                    style={{ width: "20%" }}
                  >
                    <ChatDots /> Mail
                  </Button>
                  <Button
                    variant="primary"
                    className="me-2"
                    style={{ width: "25%" }}
                  >
                    Llamada de entrada
                  </Button>
                  <InputGroup style={{ width: "35%" }}>
                    <FormControl placeholder="_____-_____-_____" />
                    <Button variant="secondary">Validar</Button>
                  </InputGroup>
                </div>
              </th>
            </tr>
          </thead>
        </Table>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>T</th>
              <th>C</th>
              <th>D</th>
              <th>S</th>
              <th>Telefono</th>
              <th>Telefonia</th>
              <th>Origen</th>
              <th>Clase</th>
              <th>Estado</th>
              <th>Municipio</th>
              <th>HusoHorario</th>
              <th>HorarioContacto</th>
              <th>Confirmado</th>
              <th>Calificacion</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                t: 7,
                c: 0,
                d: 0,
                s: 3,
                tel: "xxx-xxx-2154",
                tipo: "Móvil",
                origen: "Asignación",
                clase: "Celular",
                estado: "MEX",
                municipio: "TOLUCA",
                huso: 0,
                horario: "11:14 a.m",
                confirmado: "Check",
                calificacion: ""
              },
              {
                t: 0,
                c: 0,
                d: 0,
                s: 0,
                tel: "xxx-xxx-4017",
                tipo: "Fija",
                origen: "Asignación",
                clase: "Nuevo",
                estado: "MEX",
                municipio: "TOLUCA",
                huso: 0,
                horario: "10:09 a.m",
                confirmado: "Check",
                calificacion: ""
              },
              {
                t: 0,
                c: 0,
                d: 0,
                s: 1,
                tel: "xxx-xxx-2154",
                tipo: "Móvil",
                origen: "Asignación",
                clase: "Celular",
                estado: "MEX",
                municipio: "TOLUCA",
                huso: 0,
                horario: "01:28 p.m",
                confirmado: "Check",
                calificacion: ""
              }
            ].map((row, index) => (
              <tr key={index}>
                <td>{row.t}</td>
                <td>{row.c}</td>
                <td>{row.d}</td>
                <td>{row.s}</td>
                <td>
                  <a href="#" className="text-primary">
                    {row.tel}
                  </a>
                </td>
                <td>{row.tipo}</td>
                <td>{row.origen}</td>
                <td>{row.clase}</td>
                <td>{row.estado}</td>
                <td>{row.municipio}</td>
                <td>{row.huso}</td>
                <td>{row.horario}</td>
                <td>{row.confirmado}</td>
                <td>{row.calificacion}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default Telephones;

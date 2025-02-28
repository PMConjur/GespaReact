import { useEffect, useState } from "react";
import { Table, Card } from "react-bootstrap";
import { userNegotiations } from "../services/gespawebServices";

const NegotiationsMonth = () => {
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = 14126; //responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  const [negotiations, setNegotiations] = useState([]);

  useEffect(() => {
    if (idEjecutivo) {
      userNegotiations(idEjecutivo).then((data) => {
        setNegotiations(data.negociaciones);
        console.log(data);
      });
    }
  }, [idEjecutivo]);

  return (
    <>
      {/* Negociaciones del mes */}
      <br />
      <h5>Negociaciones del mes</h5>
      <Card className="mt-3 text-white scroll">
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Herramienta</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th>Fecha Término</th>
                  <th>Negociado</th>
                  <th>Pagado</th>
                  <th>Pagos</th>
                </tr>
              </thead>
              <tbody>
                {negotiations.length > 0 ? (
                  negotiations.map((negotiation, index) => (
                    <tr key={index}>
                      <td>{negotiation.idCuenta}</td>
                      <td>{negotiation.herramienta}</td>
                      <td>{negotiation.idEstado}</td>
                      <td>{negotiation.fechaCreacion}</td>
                      <td>{negotiation.fechaTermino}</td>
                      <td>{negotiation.montoNegociado}</td>
                      <td>{negotiation.montoPagado}</td>
                      <td>{negotiation.pagos}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Sin datos
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default NegotiationsMonth;
